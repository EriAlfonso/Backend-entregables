import multer from "multer";


const storage = (fileType) => {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const uid= req.params
        let uploadPath = '';
        if (fileType === 'profileImage') {
          uploadPath = `uploads/${uid}/profile_images/`;
        } else if (fileType === 'productImage') {
          uploadPath = `uploads/${uid}/product_images/`;
        } else if (fileType === 'document') {
          uploadPath = `uploads/${uid}/documents/`;
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      }
    });
  };
  const upload = (fileType) => multer({ storage: storage(fileType) });

  export default upload