import express from 'express';
const router = express.Router();
import { handleRegister,handleLogin,getUserData,verifyLogin } from '../controllers/authController.js'
import { verifyToken } from '../middlewares/verifyToken.js';

router.get('/getUserData',verifyToken,getUserData);
router.post('/registerUser',handleRegister);
router.post('/loginUser',handleLogin);
router.post('/isLogin',verifyToken,verifyLogin);

export default router;