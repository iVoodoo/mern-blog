import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
  loginValidation,
  registerValidation,
} from "./validations/userValidation.js";

import { postCreateValidation } from "./validations/postValidation.js";

import {
  createPost,
  deletePost,
  getAllPosts,
  getSinglePost,
  getUser,
  loginUser,
  registerUser,
  updatePost,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:1snJfNJOQPOchfs7@cluster0.jksj3o5.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR ", err));

//user: admin
//pass: 1snJfNJOQPOchfs7

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },

  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, loginUser);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  registerUser
);
app.get("/auth/me", checkAuth, getUser);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", getAllPosts);
app.get("/posts/:id", getSinglePost);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  createPost
);
app.delete("/posts/:id", checkAuth, deletePost);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  updatePost
);

app.listen(5000, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
