import {Router} from "express"
import { getAllVideos,
         publishAVideo,
         getVideoById,
         getVideoByOwner
        
        } from "../controller/video.controller.js"

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/getAllVideos").get(getAllVideos)

router.route("/publishAVideo").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }, 
        {
            name: " thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
    )

router.route("/getVideoById/:Id").get(getVideoById)
router.route("/getVideoByOwner").get(getVideoByOwner)