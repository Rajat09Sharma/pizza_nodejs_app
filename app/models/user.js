const mongoose =require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String,
        default:"customer"
    }
},{timestamps:true});
userSchema.plugin(passportLocalMongoose,{ usernameField : 'email' });

const User= mongoose.model("User",userSchema);
module.exports=User;