import mongoose from "mongoose";
import bcrypt from "bcrypt";

const premiumSchema = mongoose.Schema(
    {
        paymentID:{
            type: String,
        },
        paymentDate:{
            type: Date,
        },
        paymentAmount:{
            type: Number,
        },
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        expirationDate:{
            type: Date
        }
    },{timestamps:true}
)

premiumSchema.methods.Expiration = function(){
    const expiration = new Date(this.paymentDate.getTime() + 30*24*60*60*1000);
    this.expirationDate = expiration
}

export let Premium = mongoose.model("Pay",premiumSchema)