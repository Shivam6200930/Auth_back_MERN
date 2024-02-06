import user from '../models/user.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js';

class Usercontroller {
  static UserRegistration = async (req, res) => {
    const { name, email, password, password_confirm } = req.body;
    console.log("rec",req.body)
    const User = await user.findOne({ email: email })
    if (User) {
      res.send({ "status": "failed", "message": "User already exists" })
    } else {
      if (name && email && password && password_confirm) {
        if (password === password_confirm) {
          try {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const doc = new user({
              name: name,
              email: email,
              password: hashPassword
            })
            await doc.save()
            const saved_user = await user.findOne({ email: email })
            console.log("user saved",saved_user)
            // const token = jwt.sign({ userID: saved_user._id }, process.env.jwt_secret_key, { expiresIn: '7d' })
            res.status(200).json({ message: "data saved" });
          } catch (err) {
            res.status(400).json({ message: "something went wrong" })
          }
        } else {
          res.send({ "status": "failed", "message": "password and confrim password aren't match" });
        }
      } else {
        res.send({ "status": "failed", "message": "all fields are requried" })
      }
    }
  }

  static UserLogin = async (req, res) => {
    const { email, password } = req.body
    try {
      if (email && password) {
        const User = await user.findOne({ email: email })
        if (User != null) {
          const isMatch = await bcrypt.compare(password, User.password)
          if ((User.email === email) && isMatch) {
            // const token = jwt.sign({ userID: User._id }, process.env.jwt_secret_key, { expiresIn: '3d' })
            res.cookie('shivam',token,{httpOnly:true})
            res.status(200).json({ message: "Login Sucessfull", "user":User })
          } else {
            res.status(400).json({ message: "Invalid email or password" })
          }
        } else {
          res.send({ "status": "failed", "message": "you didn't regesister" })
        }
      } else {
        res.send({ "status": "failed", "message": "all Field are requried" })
      }
    } catch (err) {
      res.status(400).json({ message: "something went wrong" });
      console.log(err)
    }
  }

  static changeUserpassword = async (req, res) => {
    const { password, password_confirm } = req.body
    if (password && password_confirm) {
      if (password === password_confirm) {
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)
        const response=await user.findByIdAndUpdate(req.user._id, { $set: { password: hashpassword } })
        res.status(200).json({ message: "password are changed" })
      } else {
        res.status(400).json({ message: "password and re-enter aren't match " })
      }
    } else {
      res.status(400).json({ message: "all field are requried" })
    }
  }

  static loggedUser = async (req, res) => {
    res.send({ "user": req.user })
  }


  static resetPassword = async (req, res) => {
    const { email } = req.body;

    if (email) {
      const User = await user.findOne({ email: email })
      const secert = user._id + process.env.jwt_secret_key
      if (User) {
        const token = jwt.sign({ userID: user._id }, secert, { expiresIn: '10m' })
        //this linbk is work on frontend 
        const Link = `http://127.0.0.1:3000/api/users/${User._id}`
        console.log(Link)

        const mailOptions = {
          from: process.env.EMAILFROM,
          to: User.email,
          subject: "Shivam Mart Password Reset Link",
          text: 'THis mail only for a reset password',
          html: `<a href=${Link}>Click Here</a> to reset your password`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

        res.status(203).json({ status: "passed", message: "Email send for your reset password and this link are valid for only 10 min" })

      }
      else {
        res.status(403).json({ status: "falied", message: "email are doesn't exists " })
      }
    } else {
      res.status(403).json({ message: "Please enter your email address" })
    }


  }
  static userPasswordReset = async (req, res) => {
    const { password, password_confirm } = req.body
    const { id, token } = req.params
    const User = await user.findById(id)
    const new_secret = user._id + process.env.jwt_secret_key
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirm) {
        if (password === password_confirm) {
          const salt = await bcrypt.genSalt(10)
          const hashpassword = await bcrypt.hash(password, salt)
          await user.findByIdAndUpdate(User._id, { $set: { password: hashpassword } })
          res.status(200).json({ message: "password are changed" })
        } else {
          res.status(403).json({ status: "failed", message: "password and confirm password are not the same" })
        }
      } else {
        res.status(403).json({ message: "All field are requried" })
      }
    } catch (err) {
      res.status(404).json({ status: "failed", message: "Your link are exprie" })
    }
  }


  static userDelete = async (req, res) => {
    const {id}=req.params
    try{
      await user.findByIdAndDelete(id)
      res.status(200).json({ message: "User deleted are successfully"})
    }
    catch (err) {
      res.status(400).json({ status: "failed",message:"User are not deleted"})
    }
  }


  static UserLogout = async (req, res) => {
    try {
      res.clearCookie('shivam')
      return res.status(200).json('logout');
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static UserEdit =async (req, res) => {
      const id = req.params.user_id
      const User= await user.findById(id)
      const {user_name}=req.body
      if(!User){
        res.status(400).json({"message":"failed"})
      }
      else{
         User.name=user_name
         User.save()
         res.status(200).json({"message":"saved",User})
      } 
  }
}

export default Usercontroller;
