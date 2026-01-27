import { Router } from 'express';

import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controller/playlist.controller.js"


const router = Router();
import {verifyJWT} from "../middlewares/auth.middleware.js"

router.route("/createPlaylist").get(verifyJWT,createPlaylist)
router.route("/getUserPlaylists/:userId").get(verifyJWT,getUserPlaylists)
router.route("/getPlaylistById/:playlistId").get(verifyJWT,getPlaylistById)
router.route("/addVideoToPlaylist").get(verifyJWT,addVideoToPlaylist)
router.route("/removeVideoFromPlaylist").get(verifyJWT,removeVideoFromPlaylist)
router.route("/deletePlaylist/:playlistId").get(verifyJWT,deletePlaylist)
router.route("/updatePlaylist/:playlistId").post(verifyJWT,updatePlaylist)


export default router