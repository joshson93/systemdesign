const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();
const { getReviews, getMetaData, postReview, postHelpful, postReport } = require('../db/queries');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ welcome_message: 'SDC' });
});

app.get('/reviews/:productId', (req, res) => {
  const id = parseInt(req.params.productId);
  getReviews(id, (result) => {
    res.send(result);
  });
});

app.get('/reviews/:productId/meta', (req, res) => {
  const id = parseInt(req.params.productId);
  getMetaData(id, (result) => {
    res.send(result);
  });
});

app.post('/reviews/:productId', (req, res) => {
  const id = parseInt(req.params.productId);
  postReview(req.body, id);
});

app.put('/reviews/:reviewId/helpful', (req, res) => {
  const id = parseInt(req.params.reviewId);
  postHelpful(id);
});

app.put('/reviews/:reviewId/report', (req, res) => {
  const id = parseInt(req.params.reviewId);
  postReport(id);
});

//loader

app.get('/loaderio-4529c8477ac465a9151d22f467a83cd6/', (req, res) => {
  res.sendFile('/home/ec2-user/sdc/loader.txt');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log('listening on PORT ' + PORT);
});
