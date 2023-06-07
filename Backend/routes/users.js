const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
router.use(express.urlencoded({ extended: false }));


const { getUser, createUser, updateUser, deleteUser } = require("../controllers/user");


router.get("/", getUser)

router.post("/", createUser)

router.put("/:userID", updateUser)

router.delete("/:userID", deleteUser)


module.exports = router;