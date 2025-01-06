import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/database/db.js";
import dotenv from "dotenv"
import Agenda from "agenda"
import { Premium } from "./src/models/premiumModel.js";
const app = express(); 
const corsOption = {
    origin:['https://ave-flix.vercel.app','https://ave-flix.vercel.app/premium','https://ave-flix.vercel.app/register',
        'https://ave-flix.vercel.app/movieView','https://ave-flix.vercel.app/login'
    ],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept']
}
app.use(cors(corsOption));
app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
dotenv.config({path:"./.env"})
const port = process.env.PORT || 3000;
await connectDB().then(()=>{
    app.listen(port , ()=>{
        console.log("server started");
    });
}
).catch((err)=>{console.log("server not started");})
const agenda = new Agenda({ db: { address: process.env.MONGO_LINK } });

agenda.define("check expired premium users", async () => {
    try {
        const expiredUsers = await Premium.find({ expirationDate: { $lt: new Date() } });

        for (const user of expiredUsers) {
            user.paymentID = null;
            user.paymentDate = null;
            user.paymentAmount = null;
            await user.save();
            console.log(`Premium expired for user ID: ${user.userId}`);
        }
    } catch (error) {
        console.error("Error during premium expiration cleanup:", error);
    }
});
(async function () {
    await agenda.start();
    await agenda.every("* * * * *", "check expired premium users");
})();
import userroute from "./src/routes/userRoutes.js";
import { createOrder, fetchPremium, premiumUpdate } from "./src/controllers/premiumControl.js";
app.get("/",(req,res)=>{res.send("Backend Ready")})
app.use("/user",userroute);
app.post('/order',createOrder)
app.post('/premiumUpdate',premiumUpdate)
app.post('/fetchPremium',fetchPremium)
