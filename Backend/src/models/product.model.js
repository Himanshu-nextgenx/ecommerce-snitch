import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        required: true,
        enum: ["USD", "EUR", "GBP", "JPY", "INR"],
      },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    variants: [
      {
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],

        size: {
          type: String,
          enum: ["S", "M", "L", "XL"],
        },
        stock: {
          type: Number,
         default: 0,
        },
        attributes: {
          type: Map,
          of: String,
        },
        price: {
          amount: {
            type: Number,
          },
          currency: {
            type: String,
            enum: ["USD", "EUR", "GBP", "JPY", "INR"],
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
