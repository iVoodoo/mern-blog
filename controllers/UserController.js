import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, "secretJumbo", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message:
          "Авторизоваться не удалось, возможно учетная запись отсутствует",
      });
    }

    const isPassValid = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isPassValid) {
      return res.status(400).json({
        message: "Неверная пара логин-пароль",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secretJumbo", {
      expiresIn: "30d",
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось авторизоваться" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
    }

    console.log(user);
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Нет доступа" });
  }
};
