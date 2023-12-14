import { sessionRepository } from "../services/index.js"
import upload from "../middlewares/multerUploads.js";
import multer from "multer";


export default class userController {
async uploadDocument (req,res){
  try {
    if (!req.files['profileImage'] || !req.files['productImage'] || !req.files['document']) {
      return res.status(400).send(
          {
              status: 'error',
              message: 'Files missing'
          }
      );
  }
  const { uid } = req.params;
  console.log(req.files)
  const profileImage = req.files['profileImage'][0];
  const addressImage = req.files['productImage'][0];
  const accountImage = req.files['document'][0];
  console.log(uid,profileImage,addressImage,accountImage)
  const user = await sessionRepository.getUserById(uid);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.documents.push( [
      { name: 'profileImage', reference: profileImage.path },
      { name: 'document', reference: addressImage.path },
      { name: 'productImage', reference: accountImage.path }
  ]);
  await user.save();
    return res.status(200).json({ message: 'File uploaded and user updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
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
