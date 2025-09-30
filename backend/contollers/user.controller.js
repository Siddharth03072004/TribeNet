// controllers/user.controller.js

import User from "../models/user.model.js";
import  Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import { where } from "sequelize";


const convertUserDataToPDF = async (userData) => {
  // Logic to convert userData to PDF
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex")+".pdf";

  const stream = fs.createWriteStream("uploads/"+ outputPath);

  doc.pipe(stream);
  doc.image(`uploads/${userData.user.profilePicture}`, { align: "center", width: 100 });
  doc.fontSize(14).text(`Name: ${userData.user.name}`);
  doc.fontSize(14).text(`Email: ${userData.user.email}`);
  doc.fontSize(14).text(`Username: ${userData.user.username}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPosition}`);
  doc.fontSize(14).text("Past Work: ")
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};


export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists (Sequelize style)
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
    });

    // create profile linked to user
    await Profile.create({ userId: newUser.id });

    return res.status(201).json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.update(
      { token }, 
      { where: { id: user.id } }   // Sequelize uses "id" instead of "_id"
    );
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const uploadProfilePicture = async (req, res) => {
  const {token} = req.body;
  try {

    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;

    await user.save();



    

    return res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {username, email} = newUserData;

    const existingUser = await User.findOne({ where: { username, email } });
    if (existingUser) {
      if(existingUser && String(existingUser.id) !== String(user.id)){
        return res.status(400).json({ message: "Username or email already in use" });

      }
    }
    Object.assign(user, newUserData);


    await user.save();

    return res.status(200).json({ message: "user Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // fetch profile along with user details
    const userProfile = await Profile.findOne({
      where: { userId: user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "username", "profilePicture"]
        }
      ],
    });

    return res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newprofileData } = req.body;

    const userProfile = await User.findOne({ where: { token } });
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({ where: { userId: userProfile.id } });
    Object.assign(profile_to_update, newprofileData);
    await profile_to_update.save();
    


    return res.json({ message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "username", "profilePicture"]
        }
      ]
    });

    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ where: { userId: user_id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["name", "email", "username", "profilePicture"]
      }
    ]
  });

  let outputPath = await convertUserDataToPDF(userProfile);

  return res.json({"message": outputPath});

}

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ where: { userId: user.id } , include: [{ model: User, as: "user", attributes: ["id","name", "email", "username", "profilePicture"] }] });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.json({"profile": userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const sendConnectionRequest = async(req, res) => {
  const {token, connectionId} = req.body;
  try{
    const user = await User.findOne({where:{token}});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    const connectionUser = await User.findOne({where :{id:connectionId}})
    if(!connectionUser){
      return res.status(404).json({message: "Connections User not found"})
    }
    const existingRequest = await ConnectionRequest.findOne(
      {
        where: {
          userId: user.id,
          connectionId: connectionUser.id
        }
      }
    )

    if(existingRequest){
      return res.status(400).json({message: "Request already Sent"})
    }

    const request = await ConnectionRequest.create({
      userId: user.id,
      connectionId: connectionUser.id
    })

    return res.json({message: "Request Sent", request})

  } catch(error){
    return res.status(500).json({message:error.message})
  }
}

export const getMyConnectionRequest = async(req, res)=> {
  const {token} = req.query;
  try{
    const user = await User.findOne({where:{token}});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    const connections = await ConnectionRequest.findAll({where: {userId:user.id},include: [{ model: User, as: "connection", attributes: ["id","name","username", "email", "profilePicture"] }] })
    return res.json({"connections": connections});
  }catch(err){
    return res.status(500).json({message:err.message})
  }
}


export const whatAreMyConnections = async (req, res)=> {
  const {token} = req.query;
  try{
    const user = await User.findOne({where: {token}});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    const connections = await ConnectionRequest.findAll({where:{connectionId: user.id}, include: [{ model: User, as: "user", attributes: ["id","name","username", "email", "profilePicture"] }]})
    return res.json({"connections":connections})

  } catch(err){
    return res.status(500).json({message:err.message});
  }
}


export const acceptConnectionRequest = async(req, res) => {
  const {token, requestId, action_type} = req.body;
  try{
    const user = await User.findOne({where:{token}});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }
    const connection = await ConnectionRequest.findOne({where:{id:requestId}});
    if(!connection){
      return res.status(404).json({message: "Connections not found"})

    }
    if(action_type === "accept"){
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({message:"Requset Updated"})
  } catch(err){
    return res.status(500).json({message:err.message})
  }
}