import { Router } from "express"
import { adminAccess, authenticateToken, userAccess } from "../../middlewares/authentication.js";
const router = Router();

router.get('/premium/:uid',authenticateToken,adminAccess, (req, res) => {

})

router.post('/:uid/documents',authenticateToken,userAccess, (req, res) => {

})
export default router;