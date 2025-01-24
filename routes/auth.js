const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth");
const upload = require("../middleware/multer");
const { profileUpdate } = require("../controllers/profile");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/profile", upload.single("file"), profileUpdate);

module.exports = router;
