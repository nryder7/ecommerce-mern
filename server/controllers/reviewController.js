const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { comment, title, rating, product: productId } = req.body;
  const { userId } = req.user;

  if (!comment || !title || !rating) {
    throw new BadRequestError('Must provide all review information');
  }
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new BadRequestError(`No product found with id ${productId}`);
  }
  const prevReview = await Review.findOne({ product: productId, user: userId });
  if (prevReview) {
    throw new BadRequestError(`Review previously submitted`);
  }

  const review = await Review.create({
    comment,
    title,
    rating,
    product: productId,
    user: userId,
  });
  res.status(StatusCodes.CREATED).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Review deleted' });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { comment, title, rating } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new BadRequestError(`No review found with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.comment = comment;
  review.title = title;
  review.rating = rating;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new BadRequestError(`No reviews found with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name company price',
    })
    .populate({
      path: 'user',
      select: 'name',
    });
  if (!reviews) {
    throw new BadRequestError(`No reviews found`);
  }
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  deleteReview,
  updateReview,
  getSingleReview,
  getSingleProductReviews,
  getAllReviews,
};
