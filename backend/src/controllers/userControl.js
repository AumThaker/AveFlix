import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import nodemailer from "nodemailer";
import { Premium } from "../models/premiumModel.js";

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email)
      return res.status(401).json("Fill complete details");
    let userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json("Username already exists");
    const passRegEx = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/;
    if (!passRegEx.test(password))
      return res.status(403).json("Password as per conditions");
    const emailRegEx = /^[A-Za-z0-9._+\-\']+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegEx.test(email))
      return res.status(403).json("Incorrect email entered");
    const user = await User.create({
      username,
      password,
      email,
    });
    let createdUser = await User.findById(user._id);
    const premium = await Premium.create({
      paymentID: null,
      paymentDate: null,
      paymentAmount: null,
      userId: createdUser._id
    });
    if (!premium) return res.status(403).json("Premium creation failed");
    user.premium = premium._id;
    await user.save();
    const premiumLink = await User.aggregate([
      {
        $lookup: {
          from: "pays",
          localField: "premium",
          foreignField: "_id",
          as: "premiumDetails",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,   
          premiumDetails: 1,
        },
      },
    ]);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "thakeraum1511@gmail.com",
        pass: "jzjj twhi kozs hrnc",
      },
    });
    transporter.verify(function (error, success) {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("SMTP server is ready to send emails!");
      }
    });
    var mailOptions = {
      from: "thakeraum1511@gmail.com",
      to: createdUser.email,
      subject: "Account creation",
      text: "Thank you for creating account at AveFlix...",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(404).json("Email not verified");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    let updatedUser = await User.findById(user._id)
    let premiumUser = await Premium.findById(premium._id)
    return res
      .status(200)
      .json({
        result: true,
        message: "registered successfully",
        userCreated: updatedUser,
        premiumCreated: premiumUser
      });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error occurred" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(403).json("Fill complete details");
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json("User not found");
  let valPass = await user.passCheck(password);
  if (!valPass) res.status(403).json("Password incorrect");
  let token = await user.genToken();
  user.token = token;
  await user.save({ validate: false });
  return res
    .status(200)
    .cookie("LoginToken", token, { httpsOnly: true, secure: true, sameSite:"None" })
    .json({
      result: true,
      message: "User Successfully Logged In",
      loggedUser: user,
    });
};

const logoutUser = async (req, res) => {
  const token = req.cookies.LoginToken;
  if (!token) return res.status(404).json("User not logged in");
  const user = await User.findOne({ token });
  user.token = undefined;
  await user.save({ validate: false });
  return res
    .status(200)
    .clearCookie("LoginToken")
    .json(["Succesfully logged out", user]);
};

const fetchUser = async (req, res) => {
  console.log(req.cookies)
  const userToken = req.cookies.LoginToken;
  if (!userToken) return res.status(400).json("Not logged in");
  const user = await User.findOne({ token: userToken });
  if (!user) return res.status(404).json("User not found");
  const userPremium = await Premium.findOne({ userId: user._id });
  if (!userPremium) return res.status(404).json("Premium user not found");
  return res.status(200).json({ result: true, user: user , premium:userPremium});
};
export { registerUser, loginUser, logoutUser, fetchUser };
