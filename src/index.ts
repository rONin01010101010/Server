import express , {Router, type Express , type Request, type Response} from 'express'

const app: Express = express()
const port = 8080



app.use("/app", express.static("./src/app"))

app.get("/healthz", (req: Request, res: Response) => {
  try{ 
   res.set("Content-Type", "text/plain; charset=utf-8")
   return res.send('OK')
  }catch(err){
    console.log(err)
  } 
})

app.listen(port, () => {
   console.log(`Listening on port ${port}`) 
})