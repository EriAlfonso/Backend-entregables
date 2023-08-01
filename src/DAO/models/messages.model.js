import mongoose from "mongoose";

const chatCollection = "messages"

const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  });

  mongoose.set('strictQuery',false)

  const chatModel = mongoose.model(chatCollection, chatSchema);

  export default chatModel