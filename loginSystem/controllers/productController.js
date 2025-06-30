const ProductSchema = require('../model/productModel'); 

// Fetch all products
const getProduct = async (req, res) => {
  try {
    const products = await ProductSchema.find();
    if(products.length  === 0){
        res.status(404).send({
            status: false,
            message: 'product not found',
        })
    }
    return res.status(200).send(products);
  }
   catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      error,
    });
  }
};

// Fetch product by ID
const getProductById = async (req, res) => {
  try {
    const product = await ProductSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        status: false,
        message: 'Product not found',
      });
    }
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      error,
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = new ProductSchema({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      category: req.body.category,
    });
    await product.save();
    return res.status(201).send({
      status: true,
      product,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      error,
    });
  }
};

// Update product
const updateProduct = async (req, res) => { 
  try {
    const product = await ProductSchema.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.description = req.body.description || product.description;
      product.imageUrl = req.body.imageUrl || product.imageUrl;
      product.category = req.body.category || product.category;

      const updatedProduct = await product.save();
      return res.status(200).send({
        status: true,
        updatedProduct
    }); 
    } else {
      return res.status(404).send({
        status: false,
        message: 'Product not found',
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      error,
    });
  }
};

// Delete product by ID
const deleteUserById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({
        status: false,
        message: 'Product not found',
      });
    }
    return res.status(200).send({
      status: true,
      message: 'Product deleted',
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct, 
  deleteUserById,
};