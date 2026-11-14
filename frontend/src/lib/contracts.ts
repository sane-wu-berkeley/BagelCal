import { z } from 'zod';
export const objectives = ['security','growth','autonomy','connection','meaning'] as const;
export const weightsSchema = z.object(Object.fromEntries(objectives.map(k=>[k,z.number().min(0).max(1)])) as Record<typeof objectives[number], z.ZodNumber>);
export type Weights = z.infer<typeof weightsSchema>;
export const horizons = [1,5,20] as const;
export const scenarioInputSchema = z.object({option_id:z.string().regex(/^option_[0-4]$/),spread:z.number().min(0).max(.5),horizons:z.array(z.object({year:z.union([z.literal(1),z.literal(5),z.literal(20)]),criteria:weightsSchema})).length(3)});
export type ScenarioInput=z.infer<typeof scenarioInputSchema>;
const text = z.string().trim().min(1).max(2000);
export const decisionSchema = z.object({
  schema_version:z.literal('1.0'), question:text, profile:z.string().max(6000), philosophy:z.string().max(300),
  options:z.array(z.object({id:z.string().regex(/^option_[0-4]$/),label:z.string().trim().min(1).max(300),feasible:z.boolean()})).min(2).max(5),
  weights:weightsSchema, risk_aversion:z.number().min(0).max(3), analysis_source:z.enum(['scenario','elicited','remote']), scenario_inputs:z.array(scenarioInputSchema).min(2).max(5).optional(), mode:z.enum(['demo','live']),
}).superRefine((v,c)=>{
  if(new Set(v.options.map(o=>o.id)).size!==v.options.length || new Set(v.options.map(o=>o.label)).size!==v.options.length)c.addIssue({code:'custom',message:'Choices must have distinct IDs and labels.'});
  if(v.analysis_source==='elicited'&&!v.scenario_inputs)c.addIssue({code:'custom',message:'Reviewed estimates are required for assumption-based analysis.'});
  if(v.scenario_inputs){const ids=v.options.map(o=>o.id);if(v.scenario_inputs.length!==ids.length||new Set(v.scenario_inputs.map(x=>x.option_id)).size!==ids.length||v.scenario_inputs.some(x=>!ids.includes(x.option_id)||new Set(x.horizons.map(h=>h.year)).size!==3))c.addIssue({code:'custom',message:'Provide estimates for each choice and each of years 1, 5 and 20 exactly once.'});}
  if(v.options.filter(o=>o.feasible).length<2)c.addIssue({code:'custom',message:'Keep at least two feasible choices.'});
  if(Math.abs(Object.values(v.weights).reduce((a,b)=>a+b,0)-1)>1e-6)c.addIssue({code:'custom',message:'Weights must sum to one.'});
});
export type Decision = z.infer<typeof decisionSchema>;
export const evidenceSchema = z.object({id:text,label:text,kind:z.enum(['illustrative','user_provided','observed','model_estimated']),source:text,year:z.number().int().nullable(),population:z.string().max(1000),geography:z.string().max(1000)});
const unit=z.number().min(0).max(1);
export const analysisSchema=z.object({
 schema_version:z.literal('1.0'),source:z.enum(['illustrative','elicited','person_a']),suggested_weights:weightsSchema,
 actions:z.array(z.object({option_id:text,expected_utility:unit,expected_regret:unit,tail_regret:unit,score:z.number().min(-3).max(1),criteria:weightsSchema,timeline:z.array(z.object({year:z.union([z.literal(1),z.literal(5),z.literal(20)]),regret:unit})).length(3),evidence_ids:z.array(text).max(20)})).min(2).max(5),
 uncertainty:z.object({kind:z.enum(['scenario','estimated']),description:text,sample_count:z.number().int().positive().nullable()}),
 evidence:z.array(evidenceSchema).max(30),assumptions:z.array(text).min(1).max(20),method:text,
});
export type Analysis=z.infer<typeof analysisSchema>;
export const advisorIds=['future','rational','wisdom','relationship'] as const;
export const advisorMeta={future:{title:'Future Self',brief:'Compare plausible 1-, 5-, and 20-year consequences, reversibility, and aspiration. Label future narratives as conjecture.'},rational:{title:'Rational Self',brief:'Consider feasible outcomes, opportunity costs, evidence quality and downside risk. Never invent wage statistics.'},wisdom:{title:'Wisdom Self',brief:'Apply ONLY the user-selected philosophy or stated principles. Discuss obligations and meaning. Never infer religion or overwrite user values.'},relationship:{title:'Relationship Self',brief:'Consider care obligations, family, community, connection, and relational tradeoffs without assuming they dominate.'}};
export type AdvisorId=typeof advisorIds[number];
export const narrativeSchema=z.object({proposed_option_id:text,reason:z.string().min(1).max(1800),assumptions:z.array(text).min(1).max(6),uncertainty_flags:z.array(text).min(1).max(6),evidence_ids:z.array(text).max(20)});
export type Narrative=z.infer<typeof narrativeSchema>;
export type Advisor=Narrative & {id:AdvisorId;chosen_option_id:string;selection_source:'drex'|'demo';confidence:number|null;model:string};
export type Result={source:'demo'|'live';analysis:Analysis;advisors:Advisor[];arbitration:{option_id:string;confidence:number|null;probabilities:Record<string,number>;model:string;request_id:string|null};numerical_winner:string;disagreement:boolean;latency_ms:number;drex_input_tokens:number;limitations:string[]};
export function validateAnalysis(value:unknown,request:Decision):Analysis {
 const a=analysisSchema.parse(value);const ids=request.options.map(o=>o.id);
 if(a.actions.length!==ids.length||new Set(a.actions.map(o=>o.option_id)).size!==ids.length||a.actions.some(o=>!ids.includes(o.option_id)))throw new Error('Analysis option IDs do not match the request.');
 if(Math.abs(Object.values(a.suggested_weights).reduce((x,y)=>x+y,0)-1)>1e-6)throw new Error('Suggested weights must sum to one.');
 const evidence=new Set(a.evidence.map(e=>e.id));if(evidence.size!==a.evidence.length||a.actions.some(o=>o.evidence_ids.some(id=>!evidence.has(id))))throw new Error('Invalid analysis evidence references.');
 if(a.actions.some(o=>new Set(o.timeline.map(t=>t.year)).size!==3))throw new Error('Timeline must contain years 1, 5 and 20 once each.');
 return a;
}
