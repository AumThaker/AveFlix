import razorpay from "razorpay";
import { User } from "../models/userModel.js";
import { Premium } from "../models/premiumModel.js";
const createOrder = async (req, res) => {
  try {
    let instance = new razorpay({
      key_id: "rzp_test_0zj2Qh539VIZwI",
      key_secret: "BFrvGOapdH5m2XQ3ih5803GC",
    });
    const newOrder = await instance.orders.create({
      amount: 1000,
      currency: "INR",
      notes: { description: "Subscription" },
    });
    res.status(200).json(newOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json("Failed to create order");
  }
};
const premiumUpdate = async (req, res) => {
  const { paymentId, paymentDate, paymentAmount } = req.body;
  if(paymentId===null || paymentDate===null || paymentAmount===null) return res.status(400).json("payment info inappropriate")
  const userToken = req.cookies.LoginToken;
  if (!userToken) return res.status(400).json("Not logged in");
  const user = await User.findOne({ token: userToken });
  if (!user) return res.status(404).json("User not found");
  const userPremium = await Premium.findOne({ userId: user._id });
  if (!userPremium) return res.status(404).json("Premium user not found");
  userPremium.paymentID = paymentId;
  userPremium.paymentDate = paymentDate;
  userPremium.paymentAmount = paymentAmount;
  await userPremium.Expiration()
  userPremium.save();
  return res
    .status(200)
    .json({ user: user, premium: userPremium, result: true });
};
const fetchPremium = async (req, res) => {
  const userToken = req.cookies.LoginToken;
  if (!userToken) return res.status(400).json("Not logged in");
  const user = await User.findOne({ token: userToken });
  if (!user) return res.status(404).json("User not found");
  const userPremium = await Premium.findOne({ userId: user._id });
  if (!userPremium) return res.status(404).json("Premium user not found");
  if (userPremium.paymentID===null)
    return res
      .status(200)
      .json({ result: false, message: "not a premium user" });
  return res
    .status(200)
    .json({ result: true, message: "already a premium user" });
};
export { createOrder, premiumUpdate ,fetchPremium };
