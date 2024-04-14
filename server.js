const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: storage});

mongoose
    .connect("mongodb+srv://tylerlogue3:HwKBox8tlEn2Ylb8@work.5tc5e9m.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("connected to MongoDb"))
    .catch(error => console.log("couldnt connect to mongodb", error));


const craftSchema = new mongoose.Schema({
    name: String,
    description: String,
    supplies: [String],
    img: String,
});

const Craft = mongoose.model("Craft", craftSchema);


