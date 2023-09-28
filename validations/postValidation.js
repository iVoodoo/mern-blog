import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Укажите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 30 }).isString(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
