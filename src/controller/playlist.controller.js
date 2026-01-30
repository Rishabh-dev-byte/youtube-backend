
import mongoose from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description){
        throw new ApiError(404,"all fields are required for playlist")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })
    
    res.status(200).json(new ApiResponse(200,playlist,"playlist created successfully"))
  
})

const getUserPlaylists = asyncHandler(async (req, res) => {
   

    const userPlaylist = await Playlist.find({owner:req.user._id})

    return res.status.json(new ApiResponse(200,userPlaylist,"playlists by user fetched successfully"))
   

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400,"userId for userplaylist is missing")
    }

    const playlistById = await Playlist.findById(playlistId)

    return res.status.json(new ApiResponse(200,playlistById,"playlists by id fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.query
    
    if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(404,"id missing for adding video to playlist")
    }
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet:{videos:videoId}
        },
        {new:true}
    )

    return res.status(200).json(new ApiResponse(200,playlist,"video added to playlist successfully"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
     if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(404,"id missing for removing video to playlist")
    }
    
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{videos:videoId}
        },
        {new:true}
    )

    return res.status(200).json(new ApiResponse(200,playlist,"video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

     if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400,"userId for deleting playlist is missing")
    }
    
    const deletedPlaylist = await Playlist.findOneAndDelete({_id:playlistId})

    return res.status(200).json(new ApiResponse(200,deletedPlaylist,"playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

     if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400,"userId for deleting playlist is missing")
    }
    
     if(!name || !description){
        throw new ApiError(404,"all fields are required for playlist")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name,
                description:description
            }
        },
        {new:true}
    )
    
    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
