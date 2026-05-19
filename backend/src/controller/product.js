import Product from "../models/product.js";

// get bouquets
export const bouquets = async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = 'popularity' } = req.query;
        const skip = (page - 1) * limit;

        let sortOption = {};
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'newest') sortOption = { _id: -1 };
        else if (sort === 'popularity') sortOption = { popularity: -1 };

        const bouquets = await Product.find({ 
            type: 'bouquet',
            inStock: true 
        })
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Product.countDocuments({ 
            type: 'bouquet',
            inStock: true 
        });

        res.status(200).json({
            success: true,
            products: bouquets,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                productsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error fetching bouquets:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch bouquets",
            error: error.message 
        });
    }
}

// get flowers
export const flowers = async (req, res) => {
    try {
        const { page = 1, limit = 20, sort = 'popularity', category } = req.query;
        const skip = (page - 1) * limit;

        let query = { 
            type: 'flower',
            inStock: true 
        };
        
        if (category) {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'price_asc') sortOption = { price: 1 };
        else if (sort === 'price_desc') sortOption = { price: -1 };
        else if (sort === 'newest') sortOption = { _id: -1 };
        else if (sort === 'popularity') sortOption = { popularity: -1 };

        const flowers = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            products: flowers,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                productsPerPage: parseInt(limit)
            }
        });

    } catch (error) {
        console.error("Error fetching flowers:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch flowers",
            error: error.message 
        });
    }
}

// get popular products
export const popular = async (req, res) => {
        try {
        const { limit = 10 } = req.query;

        const popularProducts = await Product.find({ 
            inStock: true,
            popularity: { $gt: 0 }  // Only products with some popularity
        })
        .sort({ popularity: -1 })  // Highest popularity first
        .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            products: popularProducts,
            count: popularProducts.length
        });

    } catch (error) {
        console.error("Error fetching popular products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch popular products",
            error: error.message 
        });
    }
}

// get florist picks (for homepage)
export const floristPicks = async (req, res) => {
        try {
        const { limit = 8 } = req.query;

        const picks = await Product.find({ 
            floristPick: true,
            inStock: true 
        })
        .sort({ popularity: -1 })
        .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            products: picks,
            count: picks.length
        });

    } catch (error) {
        console.error("Error fetching florist picks:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch florist picks",
            error: error.message 
        });
    }
}

// get new products (for homepage)
export const newProducts = async (req, res) => {
    try {
        const { limit = 12 } = req.query;

        const newProducts = await Product.find({ 
            new: true,
            inStock: true 
        })
        .sort({ _id: -1 })  // Newest first (by creation date)
        .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            products: newProducts,
            count: newProducts.length
        });

    } catch (error) {
        console.error("Error fetching new products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch new products",
            error: error.message 
        });
    }
}

// get products by category
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const products = await Product.find({ 
            category: category,
            inStock: true 
        })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Product.countDocuments({ 
            category: category,
            inStock: true 
        });

        res.status(200).json({
            success: true,
            products: products,
            category: category,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });

    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch products",
            error: error.message 
        });
    }
};

// get single product by ID 
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }
        
        // Increment popularity when viewed
        product.popularity = (product.popularity || 0) + 1;
        await product.save();
        
        res.status(200).json({
            success: true,
            product: product
        });
        
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch product",
            error: error.message 
        });
    }
};

// search products
export const searchProducts = async (req, res) => {
    try {
        const { q, type, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        
        let query = { inStock: true };
        
        // Search by name or description
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
        
        // Filter by type (bouquet/flower)
        if (type) {
            query.type = type;
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }
        
        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Product.countDocuments(query);
        
        res.status(200).json({
            success: true,
            products: products,
            searchParams: { q, type, category, minPrice, maxPrice },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                productsPerPage: parseInt(limit)
            }
        });
        
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to search products",
            error: error.message 
        });
    }
};