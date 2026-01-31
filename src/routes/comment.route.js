import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controller/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();


export default router