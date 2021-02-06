import express from 'express';
import bilibili from '../controller/bilibili.js';
import huya from '../controller/huya.js';
const router = express.Router();

router.get('/huya', huya);
router.get('/bilibili', bilibili);

export default router;
