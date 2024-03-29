import chatModel from "../models/messages.model.js";

export default class chatManager {
  async saveMessage(user, message,textColor) {
    try {
      
      const newMessage = { user: user, message: message,textColor: textColor };
    await chatModel.create(newMessage);
    return newMessage;
  } catch (error) {
    throw error;
  }
}

  async getMessages() {
    try {
      const messages = await chatModel.find().lean().exec();
      return messages;
    } catch (error) {
      throw error;
    }
  }
}
