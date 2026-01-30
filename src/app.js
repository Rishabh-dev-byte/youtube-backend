import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import subscriptionRoute from "./routes/subscription.route.js"
import playlistRoute from "./routes/playlist.route.js"
import tweetRoute from "./routes/tweet.route.js"

app.use("api/v1/users",userRouter)
app.use("api/v1/videos",videoRouter)
app.use("api/v1/subscription",subscriptionRoute)
app.use("api/v1/playlist",playlistRoute)
app.use("api/v1/tweet",tweetRoute)


export default app