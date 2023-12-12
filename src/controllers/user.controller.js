import { sessionRepository } from "../services/index.js"
import upload from "../middlewares/multerUploads.js";
import multer from "multer";


export default class userController {
async uploadDocument (req,res){
    try {
        const { uid} = req.params; 
        const { fileType }  = req.body;
        console.log(fileType)
        const user = await sessionRepository.getUserById(uid); 
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        let fieldName = '';
        switch (fileType) {
          case 'profileImage':
            fieldName = 'profileImage';
            break;
          case 'productImage':
            fieldName = 'productImage';
            break;
          case 'document':
            fieldName = 'document';
            break;
          default:
            return res.status(400).json({ error: 'Invalid file type' });
        }
        const uploadMiddleware = upload(fileType).single(fieldName);
        uploadMiddleware(req, res, async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'File upload error' });
          }
          user.documents.push({ name: req.file.originalname, reference: req.file.path });
          await user.save();
          res.status(200).json({ message: 'Document uploaded and associated with user' });
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
    getUpload(req, res) {
      const userId = req.user.userData._id;
      res.render("documents", {uid: userId})
  }
  }
  const userControllerimp = new userController();
  const { uploadDocument,getUpload } = userControllerimp;
export {
uploadDocument,getUpload
}
