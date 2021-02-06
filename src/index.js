import express from 'express';
import router from './routes/live.js';

const app = new express();

app.use('/', router);
app.listen(3000, () => {
  console.log('Listen on: http://localhost:3000');
});
