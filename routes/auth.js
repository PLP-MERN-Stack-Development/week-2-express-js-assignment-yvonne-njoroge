const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateTokens = require('../middlewares/generateTokens');
const signUpBodyValidation = require('../middlewares/validateSchema');
const logInBodyValidation = require('../middlewares/validateSchema');



// Signup

router.post('/signUp', async (req, res) => {
  try {
    const {error} = signUpBodyValidation(req.body);
    if (error)
      return res
    .status(400)
    .json({error:true,message:error.details[0].message});
    
    const user = await User.findOne({email:req.body.email});
    if (user)
      return res
    .status(400)
    .json({error:true,message:"User with given email already exist"});

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrpt.hash(req.body.password, salt);

    await new User({...req.body,password: hashPassword}).save();
    res
    .status(201)
    .json({error:false,message:"Account created successfully"});

  } catch (err) {
    console.log(err);
    res.status(500).json({error:true,message:"Internal Server Error"});  
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const {error} = logInBodyValidation(req.body);
    if (error)
      return res
        .status(400)
        .json({error:true,message:error.details[0].message});
    
    const user = await User.findOne({email:req.body.email});
    if (!user)
      return res
        .status(401)
        .json({error:true,message:"Invlid email or password"});
    
     const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
     );
     if(!verifiedPassword)
      return res
        .status(401)
        .json({error:true,message:"Invalid email or password"});
     const {accessToken, refreshToken} = await generateTokens(user);
     
     res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message:"Logged in successfully"
     });

  } catch (err) {
    console.log(err);
    res.status(500).json({error:true,messsage: "InternalServer Error"});
  }
})

module.exports = router;
