import { body, ValidationChain } from "express-validator";

export const courseValidator: ValidationChain[] = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Title length should be between 3 and 50"),
  body("price")
    .optional()
    .isInt({ min: 1, max: 9999999 })
    .withMessage("Price must be a positive integer between 1 and 9999999"),
];
