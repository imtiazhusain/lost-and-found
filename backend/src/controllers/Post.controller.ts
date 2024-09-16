import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler";
import { createPostValidation } from "../utils/joiValidation";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloundinary";
import HelperMethods from "../utils/helperMethods";
import PostModel from "../models/Post.model";
import { IAuthRequest, IQuery } from "../interfaces/interfaces";

const createPost =async(req:Request,res:Response,next:NextFunction)=>{
    try {
         req.body.image = req?.file?.filename;
        const {error} = createPostValidation(req.body)
         if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }
      const { description,city,country,status,image } = req.body;

       if(req?.file){
        let uploadResult:UploadApiResponse | undefined
        try {
             const filePath = req.file?.path;
    const fileFormat = req.file?.mimetype.split('/')[1]; // Get the format like 'png', 'jpeg' etc.
     uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: image,  
        folder: "user-posts",
        format: fileFormat, // Ensure this is just the extension (e.g., 'jpg', 'png')
    });


    
       HelperMethods.deleteFileIfExists(filePath);
        } catch (error) {
            console.log(error)
            return next(createHttpError(500,'Internal server Error'))
        }   
       

     const _req = req as IAuthRequest;
      const createdPost = new PostModel({
        author:_req._id,
        description,
        city,
        country,
        status,
       
        ...(uploadResult &&{
              image:uploadResult.secure_url 
        }),
      });

      



       await createdPost.save();

      return res.status(201).json({
        status: true,
        message: "Post created successfully",
        
      });
    }

    } catch (error) {
     console.log(error)
     return next(CustomErrorHandler.serverError())   
    }
}


const allPosts = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const posts = await PostModel.find({}).populate({path:'author',select:'name profilePic country city email phoneNo'}).select('-__v')
    return res.status(200).json({
      status:true,
      postsData:posts
    })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}



const userPosts = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    // const {status,time} = req.query
    const status = req.query.status as string | undefined; // Type assertion to simplify
const time = req.query.time as string | undefined; // Type assertion to simplify

    console.log(status)
    console.log(time)
    const _req = req as IAuthRequest

    const query:IQuery={
      author:_req._id
    }

    if(status){
      query.status= status
    }

    // const sortBy:number = -1
    // if(time){
    //   sortBy = time === "Latest"? -1: 1
    // }

    const posts = await PostModel.find(query).populate({path:'author',select:'name profilePic country city email phoneNo'}).select('-__v').sort({createdAt: time === 'Latest' ? -1 : 1})
    return res.status(200).json({
      status:true,
      postsData:posts
    })
  } catch (error) {
    console.log(error)
    return next(CustomErrorHandler.serverError())
  }
}

export {createPost,allPosts,userPosts}