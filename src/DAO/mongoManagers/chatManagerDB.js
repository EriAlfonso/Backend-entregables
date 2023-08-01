import messagesModel from "../models/messages.model.js";

export default class chatManager{
  saveMessage = async (user, message) => {
    try {
      const newMessage = await messagesModel.create({ user, message });
      return newMessage;
    } catch (err) {
      return err;
    }
  };

  getMessages = async () => {
    try {
      const messages = await messagesModel.find();
      return messages;
    } catch (err) {
      return [];
    }
  };
}