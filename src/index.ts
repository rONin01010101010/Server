import express , {Router, type Express , type Request, type Response, type NextFunction
} from 'express'
import { middlewareMetricsInc } from './routes.js' 
import { APIConfig } from './config.js'

const app: Express = express()
const port = 8080
let num_req: APIConfig = {fileserverHits : 0}

//middle to count responses called before static files are served 
app.use('/app',middlewareMetricsInc)



function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
 res.on('finish', () => {
    if(res.statusCode != 200){
      console.log(`[NON-OK] ${req.method} ${req.url}- Status: ${res.statusCode}`)
    }
  })
 
  next()
}
app.use("/reset", (req: Request, res: Response) => {
    let reset = num_req.fileserverHits =- num_req.fileserverHits  
    if(reset == 0){
        res.status(200).send
    }  
    res.status(200).send
}
)
//middle ware metrics that will log the number of req in the app
app.use("/metrics", middlewareMetricsInc,(req:Request, res:Response) => {
     res.set("Content-Type", "text/plain; charset=utf-8")
     res.send(`Hits: ${num_req.fileserverHits}`)
})

 
app.get("/healthz", (req: Request, res: Response) => {
  try{ 
   res.set("Content-Type", "text/plain; charset=utf-8")
   return res.send('OK')
  }catch(err){
    console.log(err)
  } 
})
app.use(middlewareLogResponses)
app.use("/app", express.static("./src/app"))

app.listen(port, () => {
   console.log(`Listening on port ${port}`) 
})