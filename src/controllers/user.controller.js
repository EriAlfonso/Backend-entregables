import { sessionRepository } from "../services/index.js"
import upload from "../middlewares/multerUploads.js";
import multer from "multer";
import config from "../config/config.js";
import nodemailer from 'nodemailer'

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

  async getAllUsers(req, res){
    try {
      const allUsers = await sessionRepository.getUsers();
      const usersInfo = allUsers.map(user => ({
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
      }));
      res.status(200).json(usersInfo);
  } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Internal server error' });
  }}

  async deleteIdleUsers(req, res) {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const allUsers = await sessionRepository.getUsers();
        const usersToDelete = allUsers.filter(user => {
            return user.last_connection< twoDaysAgo;
        });

        await Promise.all(usersToDelete.map(async user => {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.MAIL_USER,
                    pass: config.MAIL_PASS
                }
            });

            const mailOptions = {
                from: config.MAIL_USER,
                to: user.email,
                subject: 'Account Deletion Notification',
                text: `Dear ${user.first_name},\n\nYour account has been deleted by an admin for inactivity. If you want to use our services in the future, you must create a new account.\n\nWith regards,\nIcarus TableTop Games Team`
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);
            } catch (error) {
                console.error('Error sending email', error);
            }

            await userModel.deleteOne({ _id: user._id });
        }));

        res.status(200).json({ message: 'Users deleted and emails sent successfully' });
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

  async adminPanelView(req, res){
    try {
        const allUsers = await sessionRepository.getUsers();
        console.log(allUsers)
        const usersInfo = allUsers.map(user => ({
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        }));
        res.render('adminPanel', { users: usersInfo });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
  }
  const userControllerimp = new userController();
  const { uploadDocument,getUpload,getAllUsers,adminPanelView,deleteIdleUsers} = userControllerimp;
export {
uploadDocument,getUpload,getAllUsers,adminPanelView,deleteIdleUsers
}
