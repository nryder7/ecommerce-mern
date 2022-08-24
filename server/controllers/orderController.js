const Order = require('../models/Order');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils');
const { BadRequestError, NotFoundError } = require('../errors');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'secretString';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items } = req.body;
  if (!items || items.length < 1) {
    throw new BadRequestError('No items in cart');
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError('Please provide tax and shipping fee');
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findOne({ _id: item.product });
    if (!product) {
      throw new notFoundError(`No product found with id ${item.product}`);
    }
    const { name, price, image } = product;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: item.product,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order found with id ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId });
  if (!orders) {
    throw new NotFoundError('No orders found');
  }
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError('No orders found');
  }
  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();
  res.status(StatusCodes.OK).json({ msg: 'Payment has been submitted' });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
