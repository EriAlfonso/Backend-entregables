import { Router } from "express"
import chatManager from "../../DAO/mongoManagers/chatManagerDB.js"
import { authenticateToken,userAccess } from "../../middlewares/authentication.js";

const router = Router();
const chatManagerImport = new chatManager()
router.get("/",authenticateToken,userAccess, async (req, res) => {
  try {
    const messages = await chatManagerImport.getMessages();
    if (req.accepts("json")) {
      res.json(messages);
    } else {
      res.render("chat", { messages });
    }
  } catch (error) {
    req.logger.error("Error fetching chat messages:", error);
    req.logger.fatal('Internal Server Error', { error: err })
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/",authenticateToken,userAccess, async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.status(400).json({ error: "Both user and message are required" });
  }

  try {
    const newMessage = await chatManagerImport.saveMessage(user, message);
    res.status(201).json(newMessage);
  } catch (error) {
    req.logger.error("Error saving chat message:", error);
    req.logger.fatal('Internal Server Error', { error: err })
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router