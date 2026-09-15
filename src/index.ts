import express , {Router, type Express , type Request, type Response, type NextFunction
} from 'express'

const app: Express = express()
const port = 8080



app.use("/app", express.static("./src/app"))


function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
 res.on('finish', () => {
    if(res.statusCode != 200){
      console.log(`[NON-OK] ${req.method} ${req.url}- Status: ${res.statusCode}`)
    }
  })
 
  next()
}

app.get("/healthz", (req: Request, res: Response) => {
  try{ 
   res.set("Content-Type", "text/plain; charset=utf-8")
   return res.send('OK')
  }catch(err){
    console.log(err)
  } 
})
app.use(middlewareLogResponses)
app.listen(port, () => {
   console.log(`Listening on port ${port}`) 
})