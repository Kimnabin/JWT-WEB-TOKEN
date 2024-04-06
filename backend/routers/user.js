const router = require('express').Router();
const userController = require('../controllers/userController');

// GET ALL USERS
router.get("/", userController.getAllUsers);

// DELETE USER
router.delete("/:id", userController.deleteUser);

module.exports = router;