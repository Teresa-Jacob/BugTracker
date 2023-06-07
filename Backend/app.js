const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {User , Project}= require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")




const JWT_SECRET = 'jhfbwakfhwbaefjhgkwuyefweb$%^#%^*^%$#WERDFGU&UHJ(*&%$'

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });


  
const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const usersRoutes = require('./routes/users.js')
const projectRoutes = require('./routes/projects.js')
app.use('/users', usersRoutes)
app.use('/projects', projectRoutes)

var smtpTransport = nodemailer.createTransport({
  service: 'gmail',
   host: 'smtp.gmail.com',
   port: 465,
   secure: true,
  auth: {
      user: "christeanjacob3@gmail.com",
      pass: "vghunqlrzajyyuwz"
  }
});
var rand,mailOptions,host,link;

app.post('/api/send', async(req,res)=>{
  const {email} = req.body
  const user = await User.findOne({email}).lean()
  console.log('email '+email)
  rand=Math.floor((Math.random() * 100) + 54);
  user.uniquecode=rand
  await User.updateOne({email}, { uniquecode: rand })
  console.log(user)
	host=req.get('host')
	link="http://"+req.get('host')+"/verify?id="+rand;
	mailOptions={
		to : email,
		subject : "Please confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"	
	}
	console.log(mailOptions)
	smtpTransport.sendMail(mailOptions, function(error, info){
   	 if(error){
        	console.log(error);
		res.end("error");
	 }else{
        	console.log("Message sent: " + info.response);
        return res.json({ status: 'ok' });
    	 }
   
})
})

app.get('/verify', async(req, res)=>{
  
	const user = await User.findOneAndUpdate({ uniquecode: req.query.id }, { confirmed: true })
	console.log(user);
  user.confirmed = true;
	if(user.confirmed == true)
	{
		console.log("email is verified "+ user.email);
		res.end("<h1>email is verified</h1>");
	}
	else
	{
		res.end("<h1>Request is from unknown source</h1>"+user.confirmed);
	}

})



app.post('/api/logout', async(req, res)=>{
  res.json({status: 'ok'})

})

app.post('/api/change-password', async(req, res) =>{
  const {token, newpassword: plainTextPassword} = req.body

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

  try{
  const user = jwt.verify(token, JWT_SECRET)
  const _id = user.id

  const hashedPassword = await bcrypt.hash(plainTextPassword, 10)
  await User.updateOne(
    {_id},
    {
      $set: {password: hashedPassword}
    }
  )
  res.json({status: 'ok'})
  }catch(error){
    res.json({status: 'error', error: ':(('})
  }
})

app.post('/api/login', async(req,res) =>{
  const {username, password}= req.body
  const user = await User.findOne({username}).lean()

  if(!user)
  {
    // return res.json({status:'error', error: 'Invalid username/password'})
    res.status(401).json({status:'error', error: 'Invalid username/password'})
    return;
  }
 
  if(!user.confirmed)
  {
    res.status(401).json({status:'error', error: 'Please verufy your account'})
    return;
  }
  if(await bcrypt.compare(password, user.password)){
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      JWT_SECRET
    )
    return res.json({status: 'ok', data: {token, user}})
  }

  //  res.json({status:'error', error: 'Invalid username/password'})
  res.status(400).json({status:'error', error: 'Invalid username/password'})
})

app.post('/api/register', async(req,res) =>{
  console.log(req.body)
  
  const {username, password: plainTextPassword, email}= req.body
  if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

  if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

  const password = await bcrypt.hash(plainTextPassword, 10)

  try{
    const response = await User.create({
      username,
      password,
      email
    })
    console.log('User created successfully: ', response)
  }catch(error) {
    console.log(error)
    if(error.code === 11000)
    {return res.json({status: 'error', error: 'Username/Email already in use'})
  }
  throw error
  }

  res.json({status: 'ok'})
})

app.listen(9999, ()=>{
  console.log('server listening on port 9999')
})