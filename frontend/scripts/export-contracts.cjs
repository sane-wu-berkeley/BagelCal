require('./register.cjs');const fs=require('node:fs');const {z}=require('zod');const c=require('../src/lib/contracts.ts');const {scenarioAnalysis}=require('../src/lib/analysis.ts');
for(const [name,schema] of [['decision-request',c.decisionSchema],['analysis-response',c.analysisSchema]])fs.writeFileSync(`contracts/${name}.schema.json`,JSON.stringify(z.toJSONSchema(schema),null,2)+'\n');
const d=c.decisionSchema.parse(JSON.parse(fs.readFileSync('examples/decision.json')));fs.writeFileSync('examples/analysis-response.json',JSON.stringify(scenarioAnalysis(d),null,2)+'\n');

const {mode,analysis_source,...shape}=c.decisionSchema.shape;void mode;void analysis_source;fs.writeFileSync("contracts/analysis-request.schema.json",JSON.stringify(z.toJSONSchema(z.object(shape)),null,2)+"\n");
