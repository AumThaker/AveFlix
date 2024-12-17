import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
        },
        password:{
            type:String,
            required:[true, "PASSWORD IS REQUIRED"]
        },
        email:{
            type: String,
            required: true
        },
        token:{
            type: String
        },
        premium:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Premium'
        },
    },{timestamps:true}
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.passCheck = async function(passEntered){
    let isValid = await bcrypt.compare(passEntered,this.password)
    return isValid
}
userSchema.methods.genToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.SECRET_KEY
    )
}
export let User = mongoose.model("User",userSchema)