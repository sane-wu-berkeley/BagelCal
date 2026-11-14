import { extractProfile } from '@/lib/profile';
import { checkOrigin,errorResponse,json,readJson } from '@/lib/http';
export async function POST(request:Request){try{checkOrigin(request);return json(await extractProfile(await readJson(request,2900000),request.signal));}catch(e){return errorResponse(e);}}
