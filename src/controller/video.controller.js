import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    
    const { page = 1, limit = 10} = req.query

    const videos = await Video.aggregate([
        {
            $match:{
                isPublished:true
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
                            avatar:1
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

    const allVideos = await Video.aggregatePaginate(videos,{
        page:Number(page),
        limit:Number(limit),
    });

    return res.status(200).json(
        new ApiResponse(200,allVideos,"all videos fetched successfully")
    )


    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    if(!title || !description){
        throw new ApiError(400, "title and description are required")
    }
    
    const videoFilePath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path

    if(!videoFilePath || !thumbnailPath){
        throw new ApiError(400, "paths missing!!!")
    }

    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)
     
    if(!videoFile || !thumbnail){
        throw new ApiError(400, "url missing!!!")
    }

     const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id,
        isPublished:true
       
    })

     const createdVideo = await User.findById(video._id)
    
        if (!createdVideo) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }
    
        return res.status(201).json(
            new ApiResponse(200, createdVideo, "video uploaded successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { Id } = req.params

    const video = await Video.findById(Id)
    video.views += 1
    await video.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,video,"video fetched successfully"))
})
const getVideoByOwner = asyncHandler(async(req,res)=>{

    const videos = await Video.find({owner:req.user._id})
    return res.status(200).json(new ApiResponse(200,videos,"videos by owner fetched successfully"))
})
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!title && !description && !req.file) {
    throw new ApiError(400, "Nothing to update");
  }

  const updateData = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;

  if (req.file?.path) {
    const thumbnail = await uploadOnCloudinary(req.file.path);
    updateData.thumbnail = thumbnail.url;
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(404, "Video not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedVideo, "video updated successfully")
  );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const deletedVideo = await Video.findOneAndDelete({_id:videoId})

    if (!deletedVideo) {
    throw new ApiError(404, "Video not found or unauthorized");
        }

    return res.status(200).json(new ApiResponse(200,deletedVideo,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findOne({_id:videoId})
    if(!video){
        throw new ApiError(400,"video not fetched for toggle")
    }

    video.isPublished = !video.isPublished
    await video.save({validateBeforeSave:false})

    return res.status(200).json(200,{},"video toggled successfully")


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoByOwner
}