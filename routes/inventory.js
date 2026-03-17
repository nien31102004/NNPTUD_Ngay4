var express = require('express');
var router = express.Router();

let inventoryModel = require('../schemas/inventory');
let productModel = require('../schemas/products');

// get all inventories + join product
router.get('/', async function (req, res, next) {
  try {
    let result = await inventoryModel.find().populate({ path: 'product', select: 'title price slug category' });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get inventory by id with product join
router.get('/:id', async function (req, res, next) {
  try {
    let result = await inventoryModel.findById(req.params.id).populate({ path: 'product', select: 'title price slug category' });
    if (!result) return res.status(404).send({ message: 'Inventory not found' });
    res.send(result);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

async function updateInventoryByProduct(req, res, callback) {
  try {
    let { product, quantity } = req.body;
    if (!product) return res.status(400).send({ message: 'product is required' });
    if (!Number.isFinite(quantity) || quantity <= 0) return res.status(400).send({ message: 'quantity must be number > 0' });

    let inv = await inventoryModel.findOne({ product });
    if (!inv) return res.status(404).send({ message: 'Inventory for product not found' });

    await callback(inv, quantity);
    await inv.save();
    let result = await inventoryModel.findById(inv._id).populate({ path: 'product', select: 'title price slug category' });
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

router.post('/add_stock', async function (req, res, next) {
  await updateInventoryByProduct(req, res, async (inv, quantity) => {
    inv.stock += quantity;
  });
});

router.post('/remove_stock', async function (req, res, next) {
  await updateInventoryByProduct(req, res, async (inv, quantity) => {
    if (inv.stock < quantity) throw new Error('Not enough stock to remove');
    inv.stock -= quantity;
  });
});

router.post('/reservation', async function (req, res, next) {
  await updateInventoryByProduct(req, res, async (inv, quantity) => {
    if (inv.stock < quantity) throw new Error('Not enough stock for reservation');
    inv.stock -= quantity;
    inv.reserved += quantity;
  });
});

router.post('/sold', async function (req, res, next) {
  await updateInventoryByProduct(req, res, async (inv, quantity) => {
    if (inv.reserved < quantity) throw new Error('Not enough reserved quantity for sold');
    inv.reserved -= quantity;
    inv.soldCount += quantity;
  });
});

module.exports = router;
