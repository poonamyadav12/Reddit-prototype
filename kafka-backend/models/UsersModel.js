const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    handle: {
      type: String,
    },
    gender: {
      type: String,
    },
    description: {
      type: String,
    },
    avatar: {
      type: String,
    },
    location: {
      type: String,
    },
    topics: {
      type: Array,
    },
    createdCommunities: [
      {
        ref: "community",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("user", usersSchema);
