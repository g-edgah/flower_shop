import Bouquet from '../../models/bouquet.js';
import Flower from '../../models/flower.js';
import Product from '../../models/product.js';


// get bouquets
export const bouquets = async (req, res) => {
    try {

        const { 
            occasion,
            colors,
            priceRange,
            sortBy,
            pageNo
        } = req.body;

        //console.log("Received filters:", { occasion, colors, priceRange, sortBy, pageNo });

        let limit = 20; // default items per page
        // pagination
        const skip = (pageNo - 1) * limit;

        // sorting
        let sortOption = {};
        if (sortBy === 'price low to high') sortOption = { price: 1 };
        else if (sortBy === 'price high to low') sortOption = { price: -1 };
        else if (sortBy === 'newest') sortOption = { _id: -1 };
        else if (sortBy === 'popularity') sortOption = { popularity: -1 };

        let newColors = colors
        if (newColors && newColors.includes('all')) {
            newColors = ['red', 'pink', 'blue', 'white', 'yellow', 'purple', 'black'];
            //console.log("new: "+newColors, "old: "+colors);
        }

        let newOccasion = occasion;
        if (newOccasion && newOccasion.includes('all')) {
            newOccasion = ['birthday', 'no occasion', 'bridal shower', 'wedding', 'anniversary', 'baby shower', 'apology', 'funeral'];
            //console.log(newOccasion);
        }

        //fetch boquets
        const bouquets = await Bouquet.find({ 
            type: 'bouquet',
            inStock: true,
            price: { $gte: priceRange.min, $lte: priceRange.max },
            ...(newColors.length > 0 ? { colors: { $in: newColors } } : {}),
            ...(newOccasion.length > 0 ? { category: { $in: newOccasion } } : {})
        })
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Bouquet.countDocuments({ 
            type: 'bouquet',
            inStock: true 
        });

        res.status(200).json({
            success: true,
            products: bouquets,
            pagination: {
                currentPage: parseInt(pageNo),
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
        const { 
            occasion,
            colors,
            priceRange,
            sortBy,
            pageNo
        } = req.body;

        //console.log("Received filters:", { occasion, colors, priceRange, sortBy, pageNo });

        let limit = 20; // default items per page
        // pagination
        const skip = (pageNo - 1) * limit;

        // sorting
        let sortOption = {};
        if (sortBy === 'price low to high') sortOption = { price: 1 };
        else if (sortBy === 'price high to low') sortOption = { price: -1 };
        else if (sortBy === 'newest') sortOption = { _id: -1 };
        else if (sortBy === 'popularity') sortOption = { popularity: -1 };

        let newColors = colors
        if (newColors && newColors.includes('all')) {
            newColors = ['red', 'pink', 'blue', 'white', 'yellow', 'purple', 'black'];
            //console.log("new: "+newColors, "old: "+colors);
        }

        let newOccasion = occasion;
        if (newOccasion && newOccasion.includes('all')) {
            newOccasion = ['birthday', 'no occasion', 'bridal shower', 'wedding', 'anniversary', 'baby shower', 'apology', 'funeral'];
            //console.log(newOccasion);
        }

        //fetch flowers
        const flowers = await Flower.find({ 
            type: 'flower',
            inStock: true,
            price: { $gte: priceRange.min, $lte: priceRange.max },
            ...(newColors.length > 0 ? { colors: { $in: newColors } } : {}),
            ...(newOccasion.length > 0 ? { category: { $in: newOccasion } } : {})
        })
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Flower.countDocuments({ 
            type: 'flower',
            inStock: true 
        });

        res.status(200).json({
            success: true,
            products: flowers,
            pagination: {
                currentPage: parseInt(pageNo),
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

// get popular products (only fetches from bouquets for now)
export const popular = async (req, res) => {
        try {
        const { 
            pageNo
        } = req.body;

        //console.log("Received filters:", { pageNo });

        let limit = 20; // default items per page
        // pagination
        const skip = (pageNo - 1) * limit;


        //fetch boquets
        const bouquets = await Bouquet.find({ 
            type: 'bouquet',
            inStock: true,
        })
        .sort({ popularity: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Bouquet.countDocuments({ 
            type: 'bouquet',
            inStock: true 
        });

        res.status(200).json({
            success: true,
            products: bouquets,
            pagination: {
                currentPage: parseInt(pageNo),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                productsPerPage: parseInt(limit)
            }
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