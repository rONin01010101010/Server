import express , {Router, type Express , type Request, type Response, type NextFunction
} from 'express'
import { middlewareMetricsInc } from './src/routes.js' 
import { APIConfig } from './src/config.js'

const app: Express = express()
const port = 8080

//middle to count responses called before static files are served 
app.use(middlewareMetricsInc)

app.use("/app", express.static("./src/app"))
let num_req: APIConfig = {fileserverHits : 0}


function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
 res.on('finish', () => {
    if(res.statusCode != 200){
      console.log(`[NON-OK] ${req.method} ${req.url}- Status: ${res.statusCode}`)
    }
  })
 
  next()
}

//middle ware metrics that will log the number of req in the app
app.post("/metrics", middlewareMetricsInc,(req:Request, res:Response) => {
  let hits = middlewareMetricsInc;
   res.send(`Hits: ${hits}`)
})

//handler for reseting the hits 
app.get("/reset", (req: Request, res: Response) => {
/*     let reset = num_req.fileserverHits =- num_req.fileserverHits  
    if(reset == 0){
        res.status(200)
    }  
    res.status(200) */
  res.status(200).send("reset path responded") 
})

app.get("/healthz", (req: Request, res: Response) => {
  try{ 
   res.set("Content-Type", "text/plain; charset=utf-8")
   return res.send('OK')
  }catch(err){
    console.log(err)
  } 
})


app.use("/app", express.static("./src/app"))
app.use(middlewareLogResponses)
app.listen(port, () => {
   console.log(`Listening on port ${port}`) 
});

