import { body } from "express-validator";

export const registerValidation = [
  body("email", "Почта указана неверно").isEmail(),
  body("password", "Пароль должен состоять минимум из 8 символов").isLength({
    min: 8,
  }),
  body("fullName", "Укажите имя, минимально 3 символа").isLength({ min: 3 }),
  body("avatarUrl", "Ссылка на аватар неверная").optional().isString(),
];

export const loginValidation = [
  body("email", "Почта указана неверно").isEmail(),
  body("password", "Пароль должен состоять минимум из 8 символов").isLength({
    min: 8,
  }),
];
