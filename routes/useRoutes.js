import express from 'express';
import Usercontroller from '../controllers/Usercontroller.js';
import checkUserAuth from '../middlewares/auth-middleware.js';
const router =express.Router();

//procted router 
router.use('/changepassword',checkUserAuth)
router.use('/loggedUser',checkUserAuth)
router.use('/edit',checkUserAuth)

//public 
router.post('/register',Usercontroller.UserRegistration)
router.post('/login',Usercontroller.UserLogin)
router.post('/sendresetPassword',Usercontroller.resetPassword)
router.post('/resetPassword/:id/:token',Usercontroller.userPasswordReset)
router.delete('/delete/:id',Usercontroller.userDelete)
router.get('/logout',Usercontroller.UserLogout)
router.put('/edit/:user_id',Usercontroller.UserEdit)
//procteced
router.post('/changepassword',Usercontroller.changeUserpassword)
router.get('/loggedUser',Usercontroller.loggedUser)

export default router;