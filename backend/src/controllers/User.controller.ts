import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import {loginValidation,sendOTPValidation,signupValidation,verifyEmailValidation} from '../utils/joiValidation'
import UserModel from "../models/User.model";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler";
import bcrypt from 'bcrypt'
import HelperMethods from "../utils/helperMethods";
import VerificationTokenModel from "../models/VerificationToken.model";
import EmailMethods from "../utils/email";
import { ACCESS_TOKEN_SECRET } from "../config/envConfig";
import jwt from 'jsonwebtoken'
import cloudinary from "../config/cloundinary";
import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose";
const createUser=async (req:Request,res:Response,next:NextFunction)=>{
try {

      req.body.profilePic = req?.file?.filename;
      const profilePic = req.body.profilePic;

      const { name, email, password,country,city,phoneNo } = req.body;
      // validation

      const { error } = signupValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }

      const exist = await UserModel.exists({ email: email });

      console.log('http error')
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        );
      }

    


    if(req?.file){
        let uploadResult:UploadApiResponse | undefined
        try {
             const filePath = req.file?.path;
    const fileFormat = req.file?.mimetype.split('/')[1]; // Get the format like 'png', 'jpeg' etc.
     uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: profilePic,  
        folder: "user-profiles",
        format: fileFormat, // Ensure this is just the extension (e.g., 'jpg', 'png')
    });


    
       HelperMethods.deleteFileIfExists(filePath);
        } catch (error) {
            console.log(error)
            return next(createHttpError(500,'Internal server Error'))
        }   
       

     // hashing password
      const hashedPassword = await bcrypt.hash(password, 10);

      const registerUser = new UserModel({
        name,
        email,
        ...(uploadResult &&{
              profilePic:uploadResult.secure_url 
        }),
        password: hashedPassword,
        country,
        city,
        phoneNo
      });

      const OTP = HelperMethods.generateOTP();
      const hashedOTP = await bcrypt.hash(OTP, 10);

      const verificationToken = new VerificationTokenModel({
        owner: registerUser._id,
        OTP: hashedOTP,
      });

       await verificationToken.save();



      const result = await registerUser.save();
      EmailMethods.sendEmail(registerUser.email, "Email Verification", OTP.toString());

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        userData: {
          email: result.email,
          _id: result._id,
        },
      });
    }
     
} catch (error) {
    console.log(error)
          return next(CustomErrorHandler.serverError());

}
}


const login=async (req:Request,res:Response,next:NextFunction)=>{

    try {
         const { error } = loginValidation(req.body);

      if (error) {
        return next(error);
      }

      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      //   compare password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      //   token


const accessToken = jwt.sign({_id:user._id}, ACCESS_TOKEN_SECRET as string, {
      expiresIn: "30d",
    });

      user.profilePic = `${
        process.env.SERVER_URL ? process.env.SERVER_URL : ""
      }/images/uploads/${user.profilePic}`;

      const userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePic: user.profilePic,

        accessToken: accessToken,
      };
      res.status(200).json({
        status:true,
        userData: userData,
      });
    } catch (error) {
     console.log(error)   
           return next(CustomErrorHandler.serverError());

    }
}


const verifyUser = async (req:Request,res:Response,next:NextFunction)=>{
try {
      const userID = req.body.userId;
      const OTP = req.body.OTP;
      // validation

      const { error } = verifyEmailValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }

      const isValidID = mongoose.Types.ObjectId.isValid(userID);
      if (!isValidID) {
        
        return next(CustomErrorHandler.invalidId("Invalid user ID"));
      }

      const user = await UserModel.findById(userID);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not Found"));
      }

      if (user.isVerified) {
        return next(createHttpError(403,'This account is already verified'))
      }

      const token = await VerificationTokenModel.findOne({ owner: user._id });

      if (!token) {
        return next(CustomErrorHandler.notFound("No token found"));
      }

      const isMatched = await  bcrypt.compare(OTP,token.OTP);

      if (!isMatched) {
        return next(createHttpError(422,'Please provide a valid token'))
       
      }
      user.isVerified = true;

      await VerificationTokenModel.findByIdAndDelete(token._id);
      await user.save();

      EmailMethods.sendEmail(
        user.email,
        "success message",
        "Email verified successfully"
      );

      return res.status(200).json({
        status: true,
        message: "Account verified",
      });
    } catch (error) {
      console.log(error);

           return next(CustomErrorHandler.serverError());

    }
}



const sendOTP = async (req:Request, res:Response, next:NextFunction) => {
    try {
      const userEmail = req.body.userEmail;
      const userId = req.body.userId;

     

      // validation
      const { error } = sendOTPValidation(req.body);

      if (error) {
        console.log(error.message);
        return next(createHttpError(422,error.message));
      }

      const isValidID = mongoose.Types.ObjectId.isValid(userId);

      if (!isValidID) {
        
        return next(CustomErrorHandler.invalidId("Invalid user ID"))
      }

      const user = await UserModel.findOne({ email: userEmail });
      if (!user) {
        return next(CustomErrorHandler.notFound("No user found"));
      }

      if (user.isVerified) {
        return next(createHttpError(403,'Account is already verified'))
       
      }

      const OTP = HelperMethods.generateOTP();

      const exist = await VerificationTokenModel.exists({ owner: userId });
      if (exist) {
         await VerificationTokenModel.deleteOne({
          owner: userId,
        });
      }

      const hashedOTP = await bcrypt.hash(OTP, 10);

      const verificationToken = new VerificationTokenModel({
        owner: userId,
        OTP: hashedOTP,
      });

       await verificationToken.save();
      EmailMethods.sendEmail(userEmail, "Email Verification", OTP);

      return res.status(200).json({
        status: true,
        message: "Please verify your email",
        user: {
          email: userEmail,
          user_id: userId,
        },
      });
    } catch (error) {
      console.log(error);

      return next(CustomErrorHandler.serverError());
    }
  };


export {createUser,login,verifyUser,sendOTP}