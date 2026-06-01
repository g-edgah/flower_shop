import Bouquet from '../../models/bouquet.js';
import Flower from '../../models/flower.js';
import Product from '../../models/product.js';

import Order from '../../models/order.js';

// create product
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            picturePath,
            type,
            colors,
            category,
            discount,
            new: isNew,
            floristPick,
            inStock
        } = req.body;

        // validate required fields
        if (!name || !description || !price || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, description, price, type, category"
            });
        }

        // validate price
        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        // validate discount
        if (discount && (discount < 0 || discount > 100)) {
            return res.status(400).json({
                success: false,
                message: "Discount must be between 0 and 100"
            });
        }

        

        // create new product
        if (type === 'bouquet') {

            // check if product with same name already exists
            const existingProduct = await Bouquet.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') } 
            });

        
            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "Bouquet with this name already exists"
                });
            }

            const bouquet = new Bouquet({
                name,
                description,
                price,
                picturePath: picturePath || '',
                type,
                colors: colors || [],
                category,
                discount: discount || 0,
                new: isNew || false,
                floristPick: floristPick || false,
                inStock: inStock !== undefined ? inStock : true,
                popularity: 0
            });

            await bouquet.save();

            res.status(201).json({
            success: true,
            message: "Bouquet created successfully",
            bouquet: bouquet
        });

        } else if (type === 'flower') {

            // check if product with same name already exists
            const existingProduct = await Flower.findOne({ 
                name: { $regex: new RegExp(`^${name}$`, 'i') } 
            });


            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "Flower with this name already exists"
                });
            }

            const flower = new Flower({
                name,
                description,
                price,
                picturePath: picturePath || '',
                type,
                colors: colors || [],
                category,
                discount: discount || 0,
                new: isNew || false,
                floristPick: floristPick || false,
                inStock: inStock !== undefined ? inStock : true,
                popularity: 0
            });

            await flower.save();

            res.status(201).json({
            success: true,
            message: "Flower created successfully",
            flower: flower
        });
        }


    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // find the product
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // check if product is referenced in any pending orders
        const ordersWithProduct = await Order.findOne({
            'items.product': productId,
            status: { $in: ['pending', 'processing'] }
        });

        if (ordersWithProduct) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product. It is referenced in pending orders."
            });
        }

        // delete the product
        await Product.findByIdAndDelete(productId);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            deletedProductId: productId,
            deletedProductName: product.name
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};

// update product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updates = req.body;

        // find existing product
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // validate price if being updated
        if (updates.price !== undefined && updates.price < 0) {
            return res.status(400).json({
                success: false,
                message: "Price cannot be negative"
            });
        }

        // validate discount if being updated
        if (updates.discount !== undefined && (updates.discount < 0 || updates.discount > 100)) {
            return res.status(400).json({
                success: false,
                message: "Discount must be between 0 and 100"
            });
        }

        // check for duplicate name if name is being updated
        if (updates.name && updates.name !== product.name) {
            const existingProduct = await Product.findOne({ 
                name: { $regex: new RegExp(`^${updates.name}$`, 'i') },
                _id: { $ne: productId }
            });
            
            if (existingProduct) {
                return res.status(400).json({
                    success: false,
                    message: "Product with this name already exists"
                });
            }
        }

        // update product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};

// bulk create products
export const bulkCreateProducts = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of products"
            });
        }

        const createdProducts = [];
        const errors = [];

        for (const productData of products) {
            try {
                // validate required fields
                if (!productData.name || !productData.description || !productData.price || 
                    !productData.type || !productData.category) {
                    errors.push({
                        product: productData.name || 'Unnamed product',
                        error: "Missing required fields"
                    });
                    continue;
                }

                // check for duplicate
                const existingProduct = await Product.findOne({ 
                    name: { $regex: new RegExp(`^${productData.name}$`, 'i') } 
                });
                
                if (existingProduct) {
                    errors.push({
                        product: productData.name,
                        error: "Product name already exists"
                    });
                    continue;
                }

                const product = new Product({
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    picturePath: productData.picturePath || '',
                    type: productData.type,
                    colors: productData.colors || [],
                    category: productData.category,
                    discount: productData.discount || 0,
                    new: productData.new || false,
                    floristPick: productData.floristPick || false,
                    inStock: productData.inStock !== undefined ? productData.inStock : true,
                    popularity: 0
                });

                await product.save();
                createdProducts.push(product);
                
            } catch (error) {
                errors.push({
                    product: productData.name || 'Unnamed product',
                    error: error.message
                });
            }
        }

        res.status(201).json({
            success: true,
            message: `${createdProducts.length} products created successfully`,
            createdProducts: createdProducts,
            errors: errors.length > 0 ? errors : undefined,
            totalProcessed: products.length,
            totalCreated: createdProducts.length,
            totalErrors: errors.length
        });

    } catch (error) {
        console.error("Error bulk creating products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to bulk create products",
            error: error.message
        });
    }
};

// bulk delete products
export const bulkDeleteProducts = async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of product IDs"
            });
        }

        // check if any products are referenced in pending orders
        const ordersWithProducts = await Order.findOne({
            'items.product': { $in: productIds },
            status: { $in: ['pending', 'processing'] }
        });

        if (ordersWithProducts) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete products. Some products are referenced in pending orders."
            });
        }

        // find products before deletion
        const productsToDelete = await Product.find({ _id: { $in: productIds } });
        const deletedProductNames = productsToDelete.map(p => p.name);

        // delete products
        const result = await Product.deleteMany({ _id: { $in: productIds } });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} products deleted successfully`,
            deletedCount: result.deletedCount,
            deletedProductIds: productIds,
            deletedProductNames: deletedProductNames,
            notFoundCount: productIds.length - result.deletedCount
        });

    } catch (error) {
        console.error("Error bulk deleting products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to bulk delete products",
            error: error.message
        });
    }
};

// update product stock
export const updateProductStock = async (req, res) => {
    try {
        const { productId } = req.params;
        const { inStock } = req.body;

        if (typeof inStock !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "inStock must be a boolean value"
            });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { inStock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Product stock updated to ${inStock ? 'in stock' : 'out of stock'}`,
            product: product
        });

    } catch (error) {
        console.error("Error updating product stock:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product stock",
            error: error.message
        });
    }
};

// update product discount
export const updateProductDiscount = async (req, res) => {
    try {
        const { productId } = req.params;
        const { discount } = req.body;

        if (discount === undefined || discount < 0 || discount > 100) {
            return res.status(400).json({
                success: false,
                message: "Discount must be between 0 and 100"
            });
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { discount },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // calculate discounted price
        const discountedPrice = product.price * (1 - discount / 100);

        res.status(200).json({
            success: true,
            message: `Product discount updated to ${discount}%`,
            product: {
                ...product.toObject(),
                discountedPrice: discountedPrice.toFixed(2)
            }
        });

    } catch (error) {
        console.error("Error updating product discount:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update product discount",
            error: error.message
        });
    }
};

// toggle florist pick status
export const toggleFloristPick = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.floristPick = !product.floristPick;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product ${product.floristPick ? 'added to' : 'removed from'} florist picks`,
            product: product
        });

    } catch (error) {
        console.error("Error toggling florist pick:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update florist pick status",
            error: error.message
        });
    }
};

// toggle new product status
export const toggleNewProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.new = !product.new;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product ${product.new ? 'marked as' : 'removed from'} new products`,
            product: product
        });

    } catch (error) {
        console.error("Error toggling new product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update new product status",
            error: error.message
        });
    }
};

// get all products (admin)
export const getAllProductsAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, category, inStock } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (type) query.type = type;
        if (category) query.category = category;
        if (inStock !== undefined) query.inStock = inStock === 'true';

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            products: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                productsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};