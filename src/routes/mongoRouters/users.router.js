import { Router } from "express"
import { adminAccess, authenticateToken, userAccess } from "../../middlewares/authentication.js";
import { uploadDocument } from "../../controllers/user.controller.js";
import { uploader } from "../../middlewares/multerUploads.js";
const router = Router();

router.get('/premium/:uid',authenticateToken,adminAccess, (req, res) => {

})

router.post('/:uid/documents',authenticateToken,userAccess,uploader,uploadDocument)

export default router;