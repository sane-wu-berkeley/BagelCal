import { decisionSchema } from '@/lib/contracts';
import { evaluate } from '@/lib/engine';
import { checkOrigin, errorResponse, json, readJson, ServiceError } from '@/lib/http';
// Bound expensive local runs; no prompts, documents, or keys are logged.
let active=false;
export async function POST(request:Request){
 try{checkOrigin(request);const parsed=decisionSchema.safeParse(await readJson(request));if(!parsed.success)throw new ServiceError(parsed.error.issues[0]?.message||'Invalid decision.',400);
 if(active)throw new ServiceError('Another evaluation is running. Please retry when it finishes.',429);
 active=true;try{return json(await evaluate(parsed.data,request.signal));}finally{active=false;}
 }catch(e){return errorResponse(e);}
}
