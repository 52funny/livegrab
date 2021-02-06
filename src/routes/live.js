import express from 'express';
import huya from '../controller/huya.js';
const router = express.Router();

router.get('/huya', huya);

export default router;
