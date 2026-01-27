import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "Invalid ID format");
    }

    const alreadysubscribed = await Subscription.findOneAndDelete({subscriber:req.user._id ,channel:channelId})
    
    if(!alreadysubscribed)
    {const subscription = await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })}
    

    return res.status(200).json(new ApiResponse(200,{},"added to subscription successfully"))
})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    

    const subscribers = await Subscription.aggregate([
        {
            $match:{
                 channel: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                     { $project: {fullName: 1,username: 1,avatar: 1}}
                ]
            }
            
        },
        {
           $addFields:{
            subscriber:{
            $first: "$subscriber"
               }
           }
        },

        {
          $facet: {
          channels: [{ $replaceRoot: { newRoot: "$channel" } }],
          totalCount: [{ $count: "count" }]
        }
        }
  
    ])
    res.status(200).json(
        new ApiResponse(200,subscribers[0].subscribers,"subscribers fetched successfully")
    )
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
     const subscribers = await Subscription.aggregate([
        {
            $match:{
                 subscriber: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel",
                pipeline:[
                     { $project: {fullName: 1,username: 1,avatar: 1}}
                ]
            }
            
        },
        {
           $addFields:{
            channel:{
            $first: "$channel"
               }
           }
        },

        {
          $facet: {
          subscribers: [{ $replaceRoot: { newRoot: "$channel" } }],
           totalCount: [{ $count: "count" }]
        }
        }
  
    ])
    res.status(200).json(
        new ApiResponse(200,subscribers[0].subscribers,"channels  fetched successfully")
    )
})



export{ 
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}