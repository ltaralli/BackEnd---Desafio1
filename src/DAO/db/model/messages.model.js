import mongoose from "mongoose";

const messagesCollection = "messages";

const MessagesSchema = new mongoose.Schema({
  user: {
    type: String,
    requiered: true,
  },
  message: {
    type: String,
    requiered: true,
  },
});

export default messagesModel = mongoose.model(
  messagesCollection,
  MessagesSchema
);
