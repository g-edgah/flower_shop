import Bouquet from '../../models/bouquet.js';
import Flower from '../../models/flower.js';

export const getHomeData = async (req, res) => {
    try {
        console.log("Fetching home data...");
        // Run all queries in parallel for better performance
        const [
            floristPicksResult,
            popularProductsResult,
            newProductsResult,
            bouquetsResult,
            flowersResult
        ] = await Promise.all([
            // Florist Picks
            Bouquet.find({ 
                floristPick: true,
                inStock: { $gt: 0 } 
            })
            .sort({ popularity: -1 })
            .limit(8),
            
            // Popular Products
            Bouquet.find({ 
                inStock: { $gt: 0 } 
            })
            .sort({ popularity: -1 })
            .limit(8),
            
            // New Products
            Bouquet.find({ 
                new: true,
                inStock: { $gt: 0 } 
            })
            .sort({ createdAt: -1 })
            .limit(4),
            
            // Featured Bouquets
            Bouquet.find({ 
                type: 'bouquet',
                inStock: { $gt: 0 } 
            })
            .sort({ popularity: -1 })
            .limit(8),
            
            // Featured Flowers
            Flower.find({ 
                type: 'flower',
                inStock: { $gt: 0 } 
            })
            .sort({ popularity: -1 })
            .limit(8)
        ]);


        const categories = [
            { id: 1, name: "Birthday", slug: "birthday", imagePath: "/categories/birthday.jpg" },
            { id: 2, name: "Wedding", slug: "wedding", imagePath: "/categories/wedding.jpg" },
            { id: 3, name: "Anniversary", slug: "anniversary", imagePath: "/categories/anniversary.jpg" },
            { id: 4, name: "Sympathy", slug: "sympathy", imagePath: "/categories/sympathy.jpg" },
            { id: 5, name: "Just Because", slug: "just-because", imagePath: "/categories/just-because.jpg" }
        ];


        res.status(200).json({
            success: true,
            data: {
                categories,
                floristPicks: floristPicksResult,
                popularProducts: popularProductsResult,
                newProducts: newProductsResult,
                bouquets: bouquetsResult,
                flowers: flowersResult
            }
        });

    } catch (error) {
        console.error("Error fetching home data:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch home data",
            error: error.message 
        });
    }
}
