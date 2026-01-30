import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content){
        throw new ApiError(400,"context is missing")
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user._id
    })
    
    if(!tweet){
        throw new ApiError(500,"tweet not created")
    }

    return res.status(200).json(new ApiResponse(200,tweet,"tweet created successfully"))
})

const getOwnerTweets = asyncHandler(async (req, res) => {
      

    const userTweets = await Tweet.find({owner:req.user._id}).sort({ createdAt: -1 });

    if(!userTweets){
        throw new ApiError(404,"tweets by current user not fetched")
    }

})

const getAllTweets = asyncHandler(async (req,res)=>{
    const tweets = await Tweet.aggregate([
        {
            $match:{
                isVisible:true
            }
        },

        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1,
                            _id:1
                        }
                    }
                ]
            }
        },

        
        {
             $addFields:{
                owner:{
                    $first:"$owner"

                }
            }
        }
    ])
    return res.status(200).json(
    new ApiResponse(200,tweets,"all videos fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
      const {content} = req.body 
      const { id } = req.params

      if(!content){
        throw new ApiError(404,"content is missing")
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new ApiError(400, "Invalid ID format");
        }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        id,
        {
           $set:{
            content
           } 
        },
        {new:true}
    )

    if(!updatedTweet){
        throw new ApiError(404, "Tweet not found");
    }
    
    return res.status(200).json(
    new ApiResponse(200, updatedTweet , "tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
     const {id} = req.params
     
})

export {
    createTweet,
    getOwnerTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}