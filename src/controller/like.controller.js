import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    

     if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    // If already liked → unlike
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Video unliked successfully")
        );
    }
    const videoLike = await Like.create({
        video:videoId,
        likedBy:req.user._id
    })

    if(!videoLike){
        throw new ApiError(500,"liked video missing")
    }

    return res.status(200).json(new ApiResponse(200,videoLike,"video liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    

     if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    // If already liked → unlike
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "comment unliked successfully")
        );
    }
    const commentLike = await Like.create({
        comment:commentId,
        likedBy:req.user._id
    })

    if(!commentLike){
        throw new ApiError(500,"liked comment missing")
    }

    return res.status(200).json(new ApiResponse(200,commentLike,"comment liked successfully"))
})



const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    

     if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid ID format");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    // If already liked → unlike
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(200, { liked: false }, "Video unliked successfully")
        );
    }
    const tweetLike = await Like.create({
        tweet:tweetId,
        likedBy:req.user._id
    })

    if(!tweetLike){
        throw new ApiError(500,"liked tweet missing")
    }

    return res.status(200).json(new ApiResponse(200,tweetLike,"tweet liked successfully"))
})



const getLikedVideos = asyncHandler(async (req, res) => {
      const likedVideos = await Like.aggregate([
        { 
        $match:{
        likedBy:new mongoose.Types.ObjectId(req.user._id)
        }
        },
        
        {
            $lookup:{
               from:"videos",
               localField:"video",
               foreignField:"_id",
               as:"video",  

            }
        },
        {
            $addFields:{
                 video:{
                    $first:"$video"

                }
            }
        },

        {
          $facet: {
          videos: [{ $replaceRoot: { newRoot: "$video" } }],
          totalCount: [{ $count: "count" }]
        }
        },
    ])

        const response = {
        data: likedVideos[0].videos,
        totalCount: likedVideos[0].totalCount[0]?.count || 0
        }

        return res.status(200).json( new ApiResponse (200,response,"liked videos fetched successfully"))

       
      
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}