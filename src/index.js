import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./.env'
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`the port is listening on PORT ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log(" MONGODB connection failed",error)
})