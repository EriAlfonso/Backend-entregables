import chatModel from "../models/messages.model.js";

export default class chatManager {
    async saveMessage(user, message) {
      try {
        const newMessage ={ user, message };
        await chatModel.create(newMessage);
        return newMessage;
      } catch (error) {
        throw error;
      }
    }
  
    async getMessages() {
      try {
        const messages = await chatModel.find().sort({ timestamp: 1 }).lean().exec();
        return messages;
      } catch (error) {
        throw error;
      }
    }
  }
