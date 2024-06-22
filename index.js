const express = require("express");
const { connectToMongoDB } = require("./connect")
const urlRoute = require("./routes/url");
const URL = require("./models/url")
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
                //mongodb://127.0.0.1:27017/app-1 
.then(() =>{
    console.log("MongoDB connected");
})

app.use(express.json());

app.use("/url",urlRoute);

app.get("/server",(req,res)=>{
    return res.end("<h1>Hey from the server</h1>");
})

app.get("/url/:shortId",async(req,res)=>{
    const shortId = req.params.shortId;
   const entry =  await URL.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory: {
                timestamp: Date.now()
            },
        },
    }
    );
    res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server Started at ${PORT}`));