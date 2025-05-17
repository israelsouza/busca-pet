import express from 'express'
import getUserPhotoController from '../controllers/getUserPhotoController.js';
import {getNotificationController} from '../controllers/getNotificationController.js';
import {deleteNotificationController} from '../controllers/getNotificationController.js';

const router = express.Router();

router.get('/photo/:token', getUserPhotoController) 
router.get('/notification/:token', getNotificationController)
router.delete('/notification/:id', deleteNotificationController)

export default router;