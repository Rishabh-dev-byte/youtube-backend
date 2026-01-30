import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.route("/toggleVideoLike/:videoId").get(verifyJWT,toggleVideoLike)
router.route("/toggleCommentLike/:commentId").get(verifyJWT,toggleCommentLike)
router.route("/toggleTweetLike/:tweetId").get(verifyJWT,toggleTweetLike)
router.route("/getLikedVideos").get(verifyJWT,getLikedVideos)

export default router