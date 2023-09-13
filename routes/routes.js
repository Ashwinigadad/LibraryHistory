const express=require("express");
const LibraryEntryExit=require("../mongoose");
const route=express.Router();

// route.post("/api/register",(req,res)=>{
//     res.status(200).json({message:"Done"});
//     console.log(req.body);

//     const Data= new LibraryEntryExit({
//         name: req.body.name,
//         usn: req.body.usn
    
//       });
//       try{
//         Data.save()
//       }catch(err){
//         console.log(err.message)
//       }finally{
//         console.log("saved successfully")
//       }
//  })

 route.post("/", async (req, res) => {
    try {
      const user = await LibraryEntryExit.findOne({ usn: req.body.usn }).sort({ loginTime: -1 });
      const utcTime = new Date();
  
      if (!user) {
        // User not found, create a new entry
        const newEntry = new LibraryEntryExit({
          name: req.body.name,
          usn: req.body.usn,
          history: [{ loginTime: new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000) }],
        });
  
        await newEntry.save(); 
  
        res.status(200).json({ message: "Entry recorded successfully" });
      } else {
        if (!user.history[user.history.length - 1].logoutTime) {
          // User is checked in, record exit time
          user.history[user.history.length - 1].logoutTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);
          await user.save();
  
          res.status(200).json({ message: "Exit recorded successfully" });
        } else {
          // User is checked out, log in again
          user.history.push({ loginTime: new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000) });
          await user.save();
  
          res.status(200).json({ message: "Logged in again successfully" });
        }
      }
    } catch (err) {
      console.error("Error handling entry/exit:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  module.exports=route