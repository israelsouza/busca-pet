import express from 'express'
import getUserPhotoController from '../controllers/getUserPhotoController.js';
import getNotificationController from '../controllers/getNotificationController.js';

const router = express.Router();

router.get('/photo/:token', getUserPhotoController) 
router.get('/notification/:token', getNotificationController)

export default router;