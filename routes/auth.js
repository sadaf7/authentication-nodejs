const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const JWT_SEC = "dadgfkgioifjefj";

// Route 1: Creating users using POST request // No login req
router.post('/createUser',[
body('name','Enter a valid name'),
body('email','Enter a valid email').isEmail(),
body('password','Enter a valid password').isLength({min:4})
],async(req,res)=>{
    const errors = validationResult(req);
    // data validation if there is error or emtpty string throw error
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
        // checking if the email exist or not
        let user = await User.findOne({email: req.body.user});
   if(user){
    return res.status(401).send("Sorry user with this email already exist");
   }
    // Hashing password and adding salt
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt)    
   // creating user 
    user = await User.create({ 
    name: req.body.name,
    email: req.body.email,
    password: secPass,
  })
  res.json(user);

  // JWT auth
  data={
    user:{
        id:user.id
    }
  }
  let auth = jwt.sign(data,JWT_SEC);
  console.log(auth);
    } catch (error) {
        res.status(401).send({error:"Some Internal server error"})
    }      
})

//ROUTE 2: Login user using POST req
router.post('/loginUser',[
    body('email','Enter a valid email').exists().isEmail(),
    body('password','Enter a valid password').isLength({min:4})
],async (req,res)=>{
    // data validation if there is error or emtpty string throw error
    const errors = validationResult(req);
    try {
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
          }
    
          const {email,password} = req.body
        //   authenticating email exist or not
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Enter a valid email"})
        }
        const compare = await bcrypt.compare(password,user.password);
        if(!compare){
            res.status(400).send({error:"Enter a valid password"})
        }
    
        // JWT auth
        data={
            user:{
                id:user.id
            }
        }
        let auth = jwt.sign(data,JWT_SEC);
        res.json(auth);
    } catch (error) {
        res.status(401).send({error:"Some Internal server error"})
    } 
})

// getting loggedIn users info using GET req -- login req
router.get('/getUser',fetchuser,async (req,res)=>{
    let userId = req.user.id;
    let user = await User.findById(userId).select('-password')
    res.json(user);
})
module.exports = router;