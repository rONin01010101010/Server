import express , {Router, type Express , type Request, type Response, type NextFunction} from 'express'
import { APIConfig } from './config.js'
const app: Express = express()

 let num_req: APIConfig = {fileserverHits : 0}


export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction){
   //just increment fileserver hits  
   res.send(num_req.fileserverHits += 1);
   next()
}
