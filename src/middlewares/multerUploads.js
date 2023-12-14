import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uid } = req.params;
    let uploadPath = '';

    if (file.fieldname === 'profileImage') {
      uploadPath = `uploads/${uid}/profile_images/`;
    } else if (file.fieldname === 'productImage') {
      uploadPath = `uploads/${uid}/product_images/`;
    } else if (file.fieldname === 'document') {
      uploadPath = `uploads/${uid}/documents/`;
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploader= upload.fields([
{name:'profileImage',maxCount:1},
{name:'productImage',maxCount:1},
{name:'document',maxCount:1}
])

export default upload