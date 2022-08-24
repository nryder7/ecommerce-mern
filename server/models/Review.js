const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      //   min:1,
      //   max:5
      required: [true, 'Must provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true],
      maxLength: 40,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Must leave review'],
      maxLength: 300,
    },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

//creates compound index product/user
//user can only leave one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil([result[0]?.averageRating || 0]),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {}
};

ReviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});
ReviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
