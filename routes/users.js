var express = require("express");
var router = express.Router();
let bcrypt = require('bcrypt')
let userModel = require("../schemas/users");
let { validatedResult, CreateAnUserValidator, ModifyAnUserValidator } = require('../utils/validator')
let userController = require('../controllers/users')
let { CheckLogin, checkRole } = require('../utils/authHandler')
let multer = require('multer');
let path = require('path');

// Setup multer for Excel file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
        }
    }
});

router.get("/", CheckLogin, checkRole("ADMIN","MODERATOR"), async function (req, res, next) {//ADMIN
  let users = await userController.GetAllUser()
  res.send(users);
});

router.get("/:id", async function (req, res, next) {
  let result = await userController.GetUserById(
    req.params.id
  )
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ message: "id not found" })
  }
});

router.post("/", CreateAnUserValidator, validatedResult, async function (req, res, next) {
  
  try {
    let user = await userController.CreateAnUser(
      req.body.username, req.body.password,
      req.body.email, req.body.role
    )
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/import/excel", CheckLogin, checkRole("ADMIN"), upload.single('file'), async function (req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const result = await userController.ImportUsersFromExcel(req.file.path);
    
    // Clean up uploaded file
    let fs = require('fs');
    fs.unlinkSync(req.file.path);

    if (result.success) {
      res.send({
        success: true,
        message: `Successfully imported ${result.importedCount} users`,
        importedCount: result.importedCount,
        errorCount: result.errorCount,
        errors: result.errors,
        passwords: result.passwords
      });
    } else {
      res.status(400).send({ 
        success: false, 
        message: result.message 
      });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", ModifyAnUserValidator, validatedResult, async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate
      (id, req.body, { new: true });

    if (!updatedItem) return res.status(404).send({ message: "id not found" });

    let populated = await userModel
      .findById(updatedItem._id)
    res.send(populated);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;