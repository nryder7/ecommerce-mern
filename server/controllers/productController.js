const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const Product = require('../models/Product');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  if (!product) {
    throw new BadRequestError('No product created');
  }
  res.status(StatusCodes.CREATED).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: `${productId} deleted` });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  if (!products) {
    throw new NotFoundError(`No products found`);
  }
  res.status(StatusCodes.OK).json({ products });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');
  if (!product) {
    throw new NotFoundError(`No product found with id ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ product });
};
const uploadImage = async (req, res) => {
  const { image } = req.files;
  const maxSize = 1024 * 1024;

  if (!image) {
    throw new BadRequestError('Please upload image file');
  }
  if (!image.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload image file');
  }
  if (image.size > maxSize) {
    throw new BadRequestError('Please upload image smaller than 1MB');
  }
  const uploadPath = path.join(
    __dirname,
    '../public/uploads/' + `${image.name}`
  );
  await image.mv(uploadPath);
  res.status(StatusCodes.OK).json({ msg: `image file path ${uploadPath}` });
};

module.exports = {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
};
