const express=require("express");
const route=require("./routes/routes");
const app=express();
app.use(express.json());
const port=8090;


app.use("/api/entryexit",require("./routes/routes"));
const mongoos=require("mongoose");
mongoos.connect("mongodb://localhost:27017/Register",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log("Mongodb got connected");
})
.catch(()=>{
    console.log("error");
})


app.listen(port,()=>{
    console.log(`The server started on port ${port}`);
})
