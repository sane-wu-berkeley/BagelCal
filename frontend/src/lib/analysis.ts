import { Analysis, Decision, horizons, objectives, ScenarioInput, validateAnalysis, Weights } from './contracts';

// Named sample assumptions are explicit inputs, not estimates inferred from labels.
export const exampleInputs:ScenarioInput[]=[
 {option_id:'option_0',spread:.18,horizons:[
  {year:1,criteria:{security:.35,growth:.85,autonomy:.55,connection:.45,meaning:.85}},
  {year:5,criteria:{security:.45,growth:.90,autonomy:.70,connection:.45,meaning:.90}},
  {year:20,criteria:{security:.65,growth:.80,autonomy:.80,connection:.60,meaning:.85}}]},
 {option_id:'option_1',spread:.10,horizons:[
  {year:1,criteria:{security:.80,growth:.65,autonomy:.45,connection:.80,meaning:.60}},
  {year:5,criteria:{security:.85,growth:.70,autonomy:.60,connection:.80,meaning:.65}},
  {year:20,criteria:{security:.80,growth:.65,autonomy:.70,connection:.80,meaning:.70}}]},
];
export function neutralInput(id:string):ScenarioInput{return {option_id:id,spread:.15,horizons:horizons.map(year=>({year,criteria:Object.fromEntries(objectives.map(k=>[k,.5])) as Weights}))};}
const mean=(xs:number[])=>xs.reduce((a,b)=>a+b,0)/xs.length;
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
// Exact upper-tail CVaR of equally likely discrete observations, including fractional atoms.
export function cvar(values:number[],alpha=.9):number{
 if(!values.length||alpha<0||alpha>=1)throw new Error('Invalid CVaR inputs.');
 const sorted=[...values].sort((a,b)=>b-a);let remaining=values.length*(1-alpha),total=0;
 for(const value of sorted){const take=Math.min(1,remaining);total+=take*value;remaining-=take;if(remaining<=1e-12)break;}
 return total/(values.length*(1-alpha));
}
export function scenarioAnalysis(d:Decision):Analysis {
 const reviewed=d.analysis_source==='elicited';
 const inputs=d.options.map(o=>d.scenario_inputs?.find(x=>x.option_id===o.id)||neutralInput(o.id));
 // Three common states, not three time horizons: downside, baseline, upside.
 const utility=inputs.map(input=>[-1,0,1].map(shock=>horizons.map(year=>{
  const h=input.horizons.find(h=>h.year===year)!;
  return objectives.reduce((u,k)=>u+d.weights[k]*clamp(h.criteria[k]+shock*input.spread),0);
 })));
 const pathUtility=utility.map(states=>states.map(mean));
 const best=[0,1,2].map(s=>Math.max(...pathUtility.filter((_,i)=>d.options[i].feasible).map(x=>x[s])));
 const actions=d.options.map((o,i)=>{
  const regrets=pathUtility[i].map((u,s)=>Math.max(0,best[s]-u));
  const expected=mean(pathUtility[i]),tail=cvar(regrets);
  return {option_id:o.id,expected_utility:expected,expected_regret:mean(regrets),tail_regret:tail,score:expected-d.risk_aversion*tail,
   criteria:Object.fromEntries(objectives.map(k=>[k,mean(inputs[i].horizons.map(h=>h.criteria[k]))])) as Weights,
   timeline:horizons.map((year,t)=>({year,regret:mean([0,1,2].map(s=>Math.max(0,Math.max(...utility.filter((_,j)=>d.options[j].feasible).map(x=>x[s][t]))-utility[i][s][t])))})),evidence_ids:['scenario-inputs']};
 });
 return validateAnalysis({schema_version:'1.0',source:reviewed?'elicited':'illustrative',suggested_weights:d.weights,actions,
  uncertainty:{kind:'scenario',description:reviewed?'Computed from your reviewed assumptions across three equally weighted hypothetical states. These are judgments, not measured forecasts.':'Sample assumptions only. Edit and review them before using the numerical ranking for your own decision.',sample_count:3},
  evidence:[{id:'scenario-inputs',label:reviewed?'User-reviewed scenario assumptions':'Unreviewed sample scenario assumptions',kind:reviewed?'user_provided':'illustrative',source:'Explicit criterion scores and uncertainty spreads supplied in scenario_inputs. Missing sample inputs use neutral 0.5 scores.',year:null,population:'Individual decision assumptions; no survey sample',geography:'User context only'}],
  assumptions:['Criterion satisfaction uses a 0–1 scale; 1 means fully satisfies the stated value.','Five user weights sum to one. Years 1, 5 and 20 receive equal weight; there is no discounting.','Three hypothetical shared states have equal assumed probability, not empirically estimated probability. Each criterion is shifted by minus spread, zero, or plus spread and clipped to [0,1].','A state affects every option in the same direction, with an option-specific spread. This is an explicit dependence assumption.','Regret compares full-path utility against the best feasible fixed path within each state. Horizon bars compare options separately at that horizon, so their average need not equal full-path regret.','Upper-tail CVaR uses alpha=0.90; with three equally likely states this equals the worst state regret.','No life-outcome probability, causal estimate, statistical confidence interval, or convergence claim is produced.'],
  method:'Utility = weighted criterion satisfaction, averaged over horizons. Regret = best feasible full-path utility minus path utility in each shared state. Score = expected utility − risk_aversion × CVaR90(regret).'},d);
}
export function sensitivity(d:Decision){
 return objectives.map(key=>({objective:key,points:[0,.25,.5,.75,1].map(weight=>{
  const other=objectives.filter(k=>k!==key);const total=other.reduce((s,k)=>s+d.weights[k],0);
  const weights=Object.fromEntries(objectives.map(k=>[k,k===key?weight:(1-weight)*(total?d.weights[k]/total:1/other.length)])) as Weights;
  const input={...d,weights};const a=scenarioAnalysis(input);return {weight,winner:numericalWinner(input,a)};
 })}));
}
export async function getAnalysis(d:Decision,signal?:AbortSignal):Promise<Analysis>{
 if(d.analysis_source!=='remote')return scenarioAnalysis(d);
 const endpoint=process.env.ANALYSIS_URL;if(!endpoint)throw new Error('Person A is not connected. Configure ANALYSIS_URL or choose local scenario analysis.');
 const headers:Record<string,string>={'Content-Type':'application/json'};if(process.env.ANALYSIS_API_TOKEN)headers.Authorization=`Bearer ${process.env.ANALYSIS_API_TOKEN}`;
 const {mode: _mode, analysis_source: _source,...payload}=d;void _mode;void _source;
 const r=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify(payload),signal:AbortSignal.any([AbortSignal.timeout(20000),...(signal?[signal]:[])]),redirect:'error',cache:'no-store'});
 if(!r.ok)throw new Error('Person A analysis service failed. No mock was substituted.');
 let a:Analysis;try{a=validateAnalysis(await r.json(),d);}catch{throw new Error('Person A returned analysis that does not match contracts/analysis-response.schema.json.');}
 if(a.source!=='person_a')throw new Error('Remote analysis must identify its source as person_a.');return a;
}
export function numericalWinner(d:Decision,a:Analysis){return [...a.actions].filter(x=>d.options.find(o=>o.id===x.option_id)?.feasible).sort((x,y)=>y.score-x.score||x.option_id.localeCompare(y.option_id))[0].option_id;}
