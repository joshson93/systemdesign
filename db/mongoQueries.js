const Review = require('../mongoServer/mongo');

const getReviews = (id) => {
  const reviewsObj = { product: id.toString(), page: 0, count: 100 };
  const reviews = Review.find({ product_id: id.toString() });
  reviews.then((data) => {
    const reviewsArr = [];
    const photosArr = [];
    data.forEach((el) => {
      const resultObj = {};
      resultObj.body = el.body;
      resultObj.date = new Date(el.date);
      resultObj.rating = el.rating;
      resultObj.recommend = el.recommend;
      resultObj.response = el.response;
      resultObj.reviewer_name = el.reviewer_name;
      resultObj.summary = el.summary;
      reviewsArr.push(resultObj);
    });
    console.log(photosArr);
  });
};

const getMetaData = (id) => {
  const reviews = Review.find({ product_id: id.toString() });
  reviews.then((data) => console.log(data));
};

const postReview = (body, id) => {};

const postHelpful = (id) => {};

const postReport = (id) => {};

module.exports = { getReviews, getMetaData, postReview, postHelpful, postReport };
