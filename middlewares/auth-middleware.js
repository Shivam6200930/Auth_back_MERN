import jwt from 'jsonwebtoken'
import user from '../models/user.js'



let checkUserAuth=async(req,res,next)=>{
    // const{authorization}=req.headers
    const cook=(req.cookies && req.cookies.shivam) || null
    console.log(cook)
    if(!cook){
      return res.status(400).json({
          message: 'Invalid'
      })
    }
    
      try{
            // token=authorization.split(' ')[1]
            //verify 
            const{userID}=jwt.verify(cook , process.env.jwt_secret_key)
            //getuser
            req.user= await user.findById(userID).select(`-password`)
            next();
      }catch(err){
       res.status(400).json({message:"Unauthorized User"})
      }
    
    
}

export default checkUserAuth