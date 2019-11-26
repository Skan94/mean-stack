const multer = require('multer');

const MYME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpeg',
  'image/jpg' : 'jpg '
}
const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid = MYME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mmime type');
    if(isValid) {
      error = null
    }
    cb(error,'backend/images');
  },
  filename : (req,file,cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MYME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single('image');
