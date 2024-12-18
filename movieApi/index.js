import express from "express"
import cors from "cors"
import { HOMEAPI , MovieFetch } from "./API.js";
const app = express();
const corsOption = {
    origin:['https://ave-flix.vercel.app'],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
}
app.use(cors(corsOption));
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded())
try{
    app.listen(5000,()=>{console.log("api started")})
}catch(err){
    console.log("error occured while connecting" , err)
}
app.get("/api",HOMEAPI);
app.post("/movies",MovieFetch);