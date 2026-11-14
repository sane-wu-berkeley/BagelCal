import { decisionSchema } from '@/lib/contracts';
import { getAnalysis } from '@/lib/analysis';
import { checkOrigin,errorResponse,json,readJson,ServiceError } from '@/lib/http';
export async function POST(request:Request){try{checkOrigin(request);const d=decisionSchema.safeParse(await readJson(request));if(!d.success)throw new ServiceError('Invalid analysis request.',400);try{return json(await getAnalysis(d.data,request.signal));}catch(e){throw new ServiceError(e instanceof Error?e.message:'Analysis unavailable.');}}catch(e){return errorResponse(e);}}
