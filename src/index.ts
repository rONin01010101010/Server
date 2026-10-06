import express , {Router, type Express , type Request, type Response, type NextFunction
} from 'express'
//import { middlewareMetricsInc } from './routes.js' 
import { APIConfig } from './config.js'

const app: Express = express()
const port = 8080
let num_req: APIConfig = {fileserverHits : 0}

//middle to count responses called before static files are served 
app.use('/app', (req: Request, res: Response, next: NextFunction) => {
  num_req['fileserverHits'] += 1;
   next()
})

app.use(express.json())

function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
 res.on('finish', () => {
    if(res.statusCode != 200){
      console.log(`[NON-OK] ${req.method} ${req.url}- Status: ${res.statusCode}`)
    }
  })
 
  next()
}



//middle ware metrics that will log the number of req in the app
app.get("/admin/metrics",(req:Request, res:Response) => {
     res.set("Content-Type", "text/html; charset=utf-8")
     res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${num_req.fileserverHits} times!</p>
  </body>
</html>`)
})



app.get("/api/healthz", (req: Request, res: Response) => {
  try{ 
   res.set("Content-Type", "text/plain; charset=utf-8")
   return res.send('OK')
  }catch(err){
    console.log(err)
  } 
})


app.post("/admin/reset", (req: Request, res: Response) => {
      num_req['fileserverHits'] = 0 
      res.status(200).send('Reset successful') 
})

app.post("/api/validate_chirp",(req: Request, res: Response) => {
  type data = {
    body : string
  }
  
  type wr = {
    error: string
  }
   type val = {
    valid: boolean
   }
  
   
   const res_data = req.body
   if(res_data.body.length <= 140){
     const vald : val = {
      valid: true
     }  
    res.status(200).send(vald)
   }
  
    res.send({
    "error": "Chirp is too long"
   }).status(400) 
  
})

app.use("/app", express.static("./src/app"))
app.use(middlewareLogResponses)
app.listen(port, () => {
  console.log(`Listening on port ${port}`) 
})