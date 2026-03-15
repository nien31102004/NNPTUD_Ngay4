var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
const { default: slugify } = require('slugify');

router.get('/', async function(req, res) {
  let result = await productModel.find({ isDeleted: false });
  if (req.baseUrl.includes('/api/')) {
    return res.send(result);
  }
  res.render('products', { products: result });
});

router.get('/edit/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let item = await productModel.findById(id);
    if (!item) return res.status(404).send('Product not found');
    res.render('edit-product', { product: item });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/edit/:id', async function(req, res) {
  try {
    let id = req.params.id;
    await productModel.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect('/products');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/delete/:id', async function(req, res) {
  try {
    let id = req.params.id;
    await productModel.findByIdAndUpdate(id, { isDeleted: true });
    res.redirect('/products');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.get('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({ _id: id, isDeleted: false });
    if (result) return res.send(result);
    res.status(404).send({ message: 'ID NOT FOUND' });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function(req, res) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, { replacement: '-', lower: true }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category
    });
    await newProduct.save();
    if (req.baseUrl.includes('/api/')) {
      return res.send({ message: 'Create product success', data: newProduct });
    }
    res.redirect('/products');
  } catch (error) {
    if (req.baseUrl.includes('/api/')) {
      return res.status(400).send({ message: error.message });
    }
    res.status(400).send(error.message);
  }
});

router.put('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, req.body, { new: true });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;