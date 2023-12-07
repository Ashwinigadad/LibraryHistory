const mongoose=require("mongoose")
const librarySchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    
    password:{
        type:String,
        required:true
    },
 

        
        history:[
            {
                loginTime:Date,
                logoutTime:Date,
            },
        ], 
        
})

module.exports=mongoose.model("userInfo",librarySchema);