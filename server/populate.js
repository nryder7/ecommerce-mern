const Product = require('./models/Product');
const data = require('./mockData/products.json');

async function seedData() {
  try {
    const newProducts = data.map(async (item) => {
      item.user = '62efb7e6c181f1b62cc4a33f';
      console.log(item);
      await Product.create(item);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = seedData;
