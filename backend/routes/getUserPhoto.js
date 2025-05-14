import express from 'express'
import getUserPhotoController from '../controllers/getUserPhotoController.js';

const router = express.Router();

router.get('/photo/:token', getUserPhotoController) 

export default router;