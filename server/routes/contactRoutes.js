import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', sendContactMessage);

export default router;
