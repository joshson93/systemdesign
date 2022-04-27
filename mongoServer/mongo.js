const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/fennel');
}

const { Schema } = mongoose;

const photoSchema = new Schema({
  url: String,
});

const characteristicsNameSchema = new Schema({
  name: String,
});

const characteristicsValueSchema = new Schema({
  value: Number,
});

const reviewSchema = new Schema({
  product_id: String,
  rating: Number,
  date: Number,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: [photoSchema],
  characteristics_name: [characteristicsNameSchema],
  characteristics_value: [characteristicsValueSchema],
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
