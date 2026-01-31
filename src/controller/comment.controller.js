import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params

     if (!mongoose.Types.ObjectId.isValid(videoId)) {
     throw new ApiError(400, "Invalid ID format");
         }
    const {page = 1, limit = 10} = req.query

     const videoComment =  Comment.aggregate([
            {
                $match:{
                     video:new mongoose.Types.ObjectId(videoId)
                }
            },

             {
               $lookup: {
                 from: "users",
                 localField: "owner",
                 foreignField: "_id",
                 as: "owner",
                 pipeline: [
                 {
                 $project: {
                   fullName: 1,
                   username: 1,
                   avatar: 1
                    }
                 }
            ]
        }
     },

    {
      $addFields: {
        owner: { $first: "$owner" }
      }
    },
    {
      $sort: { createdAt: -1 }
    },
  ])
   
   const allComments = await Comment.aggregatePaginate(videoComment,{
          page:Number(page),
          limit:Number(limit),
      });

  

  return res.status(200).json(new ApiResponse(200,allComments,"comments for the video fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body

    if (!mongoose.Types.ObjectId.isValid(videoId)) 
        {
            throw new ApiError(400, "Invalid ID format");
        }

    if(!content){
        throw new ApiError(400, "content is missing");
    }
    
    const comment = await Comment.create({
          content,
          videoId,
          owner:req.user._id
    })

    if(!comment){
        throw new ApiError(500,"comment not created")
    }
    
    return res.status(200).json(new ApiResponse(200,comment,"comment created successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) 
        {
            throw new ApiError(400, "Invalid ID format");
        }

    if(!content){
        throw new ApiError(400, "content is missing");
    }

    const updatedComment = await Comment.findOneAndUpdate(
     {video:videoId,owner:req.user._id},
     { $set: { content: "content" } },
     {new:true}
    )

    if(!updatedComment){
        throw new ApiError(500,"comment not updated")
    }

    return res.status(200).json(new ApiResponse(200,updatedComment,"comment updated successfully"))


})

const deleteComment = asyncHandler(async (req, res) => {
       
    const {videoId} = req.params
    
    
    if (!mongoose.Types.ObjectId.isValid(videoId)) 
        {
            throw new ApiError(400, "Invalid ID format");
        }

   
    const deletedComment = await Comment.findOneAndDelete({video:videoId,owner:req.user._id})

    if(!deletedComment){
        throw new ApiError(500,"comment not deleted")
    }

    return res.status(200).json(new ApiResponse(200,deletedComment,"comment updated successfully"))


})



export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }