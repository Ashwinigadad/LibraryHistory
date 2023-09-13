const mongoose=require("mongoose")
const librarySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
        usn:String,
        history:[
            {
                loginTime:Date,
                logoutTime:Date,
            },
        ], 
        
})

module.exports=mongoose.model("userInfo",librarySchema);