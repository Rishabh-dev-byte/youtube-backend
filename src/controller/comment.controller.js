import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
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
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }