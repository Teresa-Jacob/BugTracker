const {User} = require("../model/user")

const getUser = async (req, res) => {
  
  const result = await User.find();
  console.log(result)
  res.send(result)
};

  const createUser = async (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    
    });
  console.log(user)
    await user.save();
    res.json(user)

  }; 

  const updateUser = async (req, res) => {
   const user = await User.findOneAndUpdate(
      { _id: req.params.userID },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        },
      },
      { new: true }
    );
    res.json(user);
  };

const deleteUser = async (req, res) => {
  await User.deleteOne({ _id: req.params.userID })
  res.json('User Deleted')
};
  
  
  module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser
  };