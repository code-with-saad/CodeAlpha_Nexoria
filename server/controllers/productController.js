import Product from '../models/Product.js';

// @desc    Fetch all products (with search, category filters, sorting & pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { search, keyword, category, isFeatured, sort, page = 1, limit = 12 } = req.query;
    const filter = {};

    const searchTerm = search || keyword;
    if (searchTerm) {
      filter.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (category && category.trim() !== '') {
      filter.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // Determine sort order
    let sortOptions = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc' || sort === 'lowest') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc' || sort === 'highest') {
      sortOptions = { price: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json({
        success: true,
        data: product
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock, isFeatured } = req.body;

    if (!name || !description || price === undefined || !image || !category || stock === undefined) {
      res.status(400);
      throw new Error('Please provide name, description, price, image, category, and stock');
    }

    const isFeaturedBool = isFeatured === true || isFeatured === 'true';

    // If new product is set as featured flagship, unset isFeatured on all existing products
    if (isFeaturedBool) {
      await Product.updateMany({}, { isFeatured: false });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      stock: Number(stock),
      isFeatured: isFeaturedBool
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.image = image !== undefined ? image : product.image;
    product.category = category !== undefined ? category : product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    if (isFeatured !== undefined) {
      const willBeFeatured = isFeatured === true || isFeatured === 'true';
      if (willBeFeatured) {
        // Enforce that only one product can be flagship at any time
        await Product.updateMany({ _id: { $ne: product._id } }, { isFeatured: false });
      }
      product.isFeatured = willBeFeatured;
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
