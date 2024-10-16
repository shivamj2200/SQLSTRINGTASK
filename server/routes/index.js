const express = require("express");
const controller = require('../controllers/controller')
const router  =  express.Router();
const auth = require('../middleware/authentication');
const role = require('../middleware/role');
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      );
    },
  });

const upload = multer({ storage: storage });

router.post(
    '/upload',
    [auth.authenticate, role(['uploader']), upload.single('document')],
    documentController.uploadDocument
  );

router.get(
    '/pending',
    [auth.authenticate, role(['approver'])],
    documentController.getPendingDocuments
  );
  router.get(
    '/pending/:id',
    [auth.authenticate, role(['approver'])], 
    documentController.getPendingDocument 
  );
  
 
router.put(
    '/approve/:id',
    [auth.authenticate, role(['approver'])],
    documentController.approveDocument
  );
router.post("/createUser", controller.createUser);
router.post("/login",controller.loginUser)
router.post('/logout', controller.logoutUser);

module.exports = router;