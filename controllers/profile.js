const User = require("../models/User");

const profileUpdate = async (req, res) => {
    try {
      const { name, email , age} = req.body;
  
      const userData = await User.findOne({ email:email });
      if (!userData) {
        return res.status(400).json({ message: "email does not exist" });
      }
  
      // Update fields if provided
      if (name) userData.name = name;
      if (age) userData.age = age;
  
      // Update profile image if a file is uploaded`
      if (req.file) {
        userData.profileImage = req.file.filename;
        userData.filepath= "/uploads"
      }
  
      await userData.save();
  
      res.status(200).json({
        message: "Profile updated successfully",
        userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  module.exports = profileUpdate;
  
module.exports = { profileUpdate };
