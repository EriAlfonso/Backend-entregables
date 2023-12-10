import { sessionRepository } from "../services.js"

export const uploadDocument =async (req,res)=>{
    try {
        const { userid,fileType} = req.params; 
        const user = await sessionRepository.getUserById(userid); 
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        // For instance, if using the 'upload' middleware exported from your previous code:
        // Set the file type (document in this case)
        const uploadMiddleware = upload(fileType).single('document'); // Use the upload middleware
    
        uploadMiddleware(req, res, async (err) => {
          if (err) {
            return res.status(500).json({ error: 'File upload error' });
          }
    
          // Add the document to the user's documents array
          user.documents.push({ name: req.file.originalname, reference: req.file.path });
          await user.save(); // Save the updated user with the new document
    
          res.status(200).json({ message: 'Document uploaded and associated with user' });
        });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };
