import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getOwnerTweets,
    updateTweet,
    getAllTweets
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/createTweet").post(verifyJWT,createTweet)
router.route("/getOwnerTweets").post(verifyJWT,getOwnerTweets)
router.route("/getAllTweets").get(verifyJWT,getAllTweets)
router.route("/updateTweet/:id").get(verifyJWT,updateTweet)


export default router