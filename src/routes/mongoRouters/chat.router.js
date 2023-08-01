import { Router } from "express"
import chatManager from "../../DAO/mongoManagers/chatManagerDB.js"

const router = Router()
const chatManagerImport=new chatManager()

router.get("/chat", async (req, res) => {
    try {
      const messages = await chatManagerImport.getMessages();
      res.render("chat", { messages }); // Pass the messages data to the "chat" template
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
export default router