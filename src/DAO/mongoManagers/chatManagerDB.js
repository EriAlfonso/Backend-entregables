import messagesModel from "../models/messages.model";

export default class chatManager{
    saveMessage = async (message) => {
        try {
          const newMessage = await ChatModel.create(message);
    
          return "Message saved";
        } catch (err) {
          return err;
        }
      };
    
      getMessages = async () => {
        try {
          const messages = await ChatModel.find();
    
          return messages;
        } catch (err) {
          console.log("No messages");
    
          return [];
        }
      };
    }

