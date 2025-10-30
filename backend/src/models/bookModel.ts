import mongoDB from "../config/mongodb";
import mongoose from "mongoose";

export interface Buku {
  id?: number;
  title: String;
  author: String;
  publisher: String;
  year: Number;
  genre: [String];
  synopsis: String;
  rating: Number;
  coverUrl: String;
}

const Schema = mongoose.Schema;

export const bukuSchema = new Schema<Buku>({
  id:{
    type: Schema.Types.Number,
  },
  title: {
    type: Schema.Types.String,
  },
  author: {
    type: Schema.Types.String,
  },
  publisher: {
    type: Schema.Types.String,
  },
  year: {
    type: Schema.Types.Number,
  },
  genre: [{
    type: Schema.Types.String,
  }],
  synopsis: {
    type: Schema.Types.String,
  },
  rating: {
    type: Schema.Types.Number,
  },
  coverUrl: {
    type: Schema.Types.String,
  },
},
{
    timestamps: true,
  }
);

export const bukuModel = mongoose.model("Buku", bukuSchema);