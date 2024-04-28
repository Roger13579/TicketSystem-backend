import { Schema, model } from 'mongoose';

interface IProduct {
  title: string;
  type: string;
  genre: string;
  vender: string;
  location: string;
  price: number;
  amount: number;
  package: object;
  startAt: Date;
  endAt: Date;
  sellStartAt: Date;
  sellEndAt: Date;
  recommendWeight: number;
  isPublic: boolean;
  isLaunched: boolean;
  tags: [string];
  photoPath: string;
  notification: [string];
  highlight: [string];
  introduction: string;
  caution: [string];
  confirmation: [string];
  cancelPolicy: [string];
  certificate: [string];
  comments: [string];
}

const schema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
  },
  type:{
    type: String,
    enum: ["premier", "corporateBooking", "privateBooking", "preScreeningMeeting", "postScreeningMeeting", "specialEvent", "openAir"],
    required: true,
  },
  genre: {
    type: String,
    enum: ["Action", "Adventure", "Comedy", "Dram", "Horro", "Fantasy", "Romance", "Animation", "Thriller", "Mystery" , "ScienceFictio", "Musical", "Music", "War", "Western", "Epic", "Historical"],
    required: true,
  },
  vender: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  package: {
    type: [
      {
        plan: String,
        discount: String,
        amount: Number,
      }
    ],
  },
  startAt: {
    type: Date,
    required: true,
  },
  endAt: {
    type: Date,
    required: true,
  },
  sellStartAt: {
    type: Date,
    required: true,
  },
  sellEndAt: {
    type: Date,
    required: true,
  },
  recommendWeight: {
    type: Number,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  isLaunched: {
    type: Boolean,
    required: true,
  },
  tags: {
    type: [
      {
        tagId: Schema.Types.ObjectId,
        ref: "Tag",
      }
    ],
  },
  photoPath: {
    type: String,
    required: true,
  },
  notification: {
    type: [String],
  },
  highlight: {
    type: [String],
  },
  introduction: {
    type: String,
    required: true,
  },
  caution: {
    type: [String],
  },
  confirmation: {
    type: [String],
  },
  cancelPolicy: {
    type: [String],
  },
  certificate: {
    type: [String],
  },
  comments: {
    type: [
      {
        commentId: {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        }
      }
    ],
  },
});

const ProductModel = model<IProduct>('Product', schema);

export default ProductModel;
