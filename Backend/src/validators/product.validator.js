import { body, validationResult } from "express-validator";


const validateRequest = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
     return res.status(400).json({
        errors: errors.array()
     }) 
    }
    next();

}

export const createProductValidator = [
    body("title").notEmpty().withMessage("Product name is required"),
    body("description").notEmpty().withMessage("Product description is required"),
    body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required"),
    validateRequest
]

// export const addProductVariantValidator = [
//     body("size")
//       .notEmpty()
//       .withMessage("Variant size is required")
//       .isIn(["S", "M", "L", "XL"])
//       .withMessage("Variant size must be S, M, L, or XL"),
//     body("stock")
//       .isInt({ min: 0 })
//       .withMessage("Variant stock must be a non-negative number"),
//     body("variantPriceAmount")
//       .isFloat({ min: 0 })
//       .withMessage("Variant price must be a non-negative number"),
//     body("variantPriceCurrency")
//       .notEmpty()
//       .withMessage("Variant price currency is required")
//       .isIn(["USD", "EUR", "GBP", "JPY", "INR"])
//       .withMessage("Variant currency is invalid"),
//     body("attributes")
//       .optional()
//       .custom((value) => {
//         if (!value) return true;
//         const parsed = JSON.parse(value);
//         return parsed && typeof parsed === "object" && !Array.isArray(parsed);
//       })
//       .withMessage("Attributes must be a valid object"),
//     validateRequest
// ]
