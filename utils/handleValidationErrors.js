import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);

  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};
