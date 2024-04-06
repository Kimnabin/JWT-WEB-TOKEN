const User = require("../models/User");

const userController = {
    // GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        };
    },

    // DELETE USER
    deleteUser: async (req, res) => {
        try {
            // gia xoa user va thong bao ra man hinh
            const user = await User.findById(req.params.id);
            // xoa user o DB va thong bao ra man hinh
            // const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete user success!~");
        } catch (error) {
            res.status(500).json(error);
        }
    },
    
};


module.exports = userController;