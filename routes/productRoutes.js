const express = require('express');
const router = express.Router();
const validateProduct = require('../middleware/validateProduct');
const Product = require('../models/products');

//Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } 
  catch (error) {
    console.error("Error fetching products:", error);
    res.status(400).send({ error: "Internal server error" });
  }
});

// Get a specific product
router.get('/:id', async (req, res,) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  }
   catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//Create a new product
router.post('/', validateProduct, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).send(newProduct);
  } 
  catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//  Update a product
router.put('/:id', validateProduct, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(updatedProduct);
  } 
  catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//  Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
//GET all with filter,search ,pagination
router.get('/search', async (req, res) => {
  try {
    const { category, inStock, search, page = 1, limit = 2 } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (inStock) {
      query.inStock = inStock === 'true';
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.send({
      products,
      totalProducts,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//GET Stats by category
router.get('/stats/category', async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: "$price" },
        },
      },
    ]);

    res.send(categoryStats);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
;
module.exports = router;
