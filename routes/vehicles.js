const { Router } = require('express');
const multer = require('multer');

const { vehiclesGet,
        vehiclesPost,
        vehiclesDelete,
        uploadImage } = require('../controllers/vehicles');
const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', vehiclesGet);
router.post('/', vehiclesPost);
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/', vehiclesDelete);

router.post('register', )
module.exports = router;
