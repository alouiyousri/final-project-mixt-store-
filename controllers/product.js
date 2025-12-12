const Product = require("../models/product");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier"); // npm i streamifier if not installed

// Add Product (supports multer diskStorage or memoryStorage)
exports.addproduct = async (req, res) => {
  try {
    console.log("addproduct body:", req.body);
    console.log("addproduct files:", req.files);

    const { name, description, price, category, stock, size } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        msg: "Missing required fields",
        required: ["name", "description", "price", "category"]
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "At least one image is required" });
    }

    const uploadOne = (file) => {
      // if multer wrote file to disk -> file.path exists
      if (file.path) {
        return cloudinary.uploader.upload(file.path);
      }
      // memoryStorage -> file.buffer exists
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    };

    const images = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadOne(file);
        return { url: result.secure_url, public_id: result.public_id };
      })
    );

    const newProduct = new Product({
      name,
      description,
      price: price !== undefined ? Number(price) : undefined,
      category,
      stock: stock !== undefined ? Number(stock) : 0,
      size,
      images,
    });

    await newProduct.save();
    res.status(201).json({ msg: "Product added", product: newProduct });
  } catch (error) {
    console.error("addproduct error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get All Products
exports.getproducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get Single Product by ID
exports.getproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ msg: "Product not found" });
    }
    res.status(200).send({ product });
  } catch (error) {
    res.status(400).send({ msg: "Error fetching product", error });
  }
};

// Delete Product by ID (and remove image from Cloudinary)
exports.deleteproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ msg: "Product not found" });

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();
    res.status(200).send({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(400).send({ msg: "Error deleting product", error });
  }
};

// Edit Product by ID (optionally update and delete previous images)
exports.editproduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // convert numeric fields if present
    if (updateData.price !== undefined && updateData.price !== "") {
      updateData.price = Number(updateData.price);
    }
    if (updateData.stock !== undefined && updateData.stock !== "") {
      updateData.stock = Number(updateData.stock);
    }

    console.log("Incoming form data:", updateData);

    const product = await Product.findById(id);
    if (!product) {
      console.error("Product not found:", id);
      return res.status(404).send({ msg: "Product not found" });
    }

    let images = product.images;

    if (req.files?.length || req.file) {
      console.log("Images are being updated");
      if (images?.length) {
        for (const img of images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      images = [];

      if (req.files?.length) {
        images = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return {
              url: result.secure_url,
              public_id: result.public_id,
            };
          })
        );
      } else if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      updateData.images = images;
    }

    console.log("Final update data:", updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).send({
      msg: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Edit product error:", error);
    res.status(500).send({ msg: "Error updating product", error });
  }
};
