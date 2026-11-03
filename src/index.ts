import express , {Router, type Express , type Request, type Response, type NextFunction
} from 'express'
//import { middlewareMetricsInc } from './routes.js' 
import { APIConfig } from './config.js'
import {Forbidden, NotFound, BadRequest, Unauthorized} from './errclasses.js'

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

//error middleware function 
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
console.log(`this is the err`,err)

if(err instanceof NotFound){
  res.status(404).json({error: err.message})
}

if(err instanceof BadRequest){
  res.status(400).json({error: err.message})
}

if(err instanceof Unauthorized){
  res.status(401).json({error: err.message})
}

if(err instanceof Forbidden){
  res.status(403).json({error: err.message})
}


res.status(500).json({
  error: "Something went wrong on our end"
})

next(err)


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

app.post("/api/validate_chirp", async (req: Request, res: Response, next: NextFunction) => {
 
  
  type wr = {
    error: string
  }
   type val = {
    valid: boolean
   }
  try {
   const res_data = req.body
   
   
   if(res_data.body.length <= 140){
      
      let clean: string[] = res_data.body.split(" ") 
      let pattern = /\b(?:[Kk]erfuffle|KERFUFFLE|[Ss]harbert|SHARBERT|[Ff]ornax|FORNAX)\b/

      for(let i = 0; i < clean.length; i++){
        if(pattern.test(clean[i])){
           clean[i] = '****'
        }
         clean.join(" ")
      }

      return res.status(200).send({
        "cleanedBody": clean.join(" ")

    })    
    } 
  }catch(err){
   return next(err) 
  }
 
   })

app.use("/app", express.static("./src/app"))
app.use(middlewareLogResponses)
app.use(errorHandler) //error handler

app.listen(port, () => {
  console.log(`Listening on port ${port}`) 
})