import { Router } from "express"
import chatManager from "../../DAO/mongoManagers/chatManagerDB"

const router = Router()

router.get("/", async (req, res) => {
    const messages = await chatManager.getMessages();
    res.render("chat", {messages})
})

export default router