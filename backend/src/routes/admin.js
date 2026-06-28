import express from 'express'

import { verifyToken, verifyAdmin } from '../middleware/auth.js'
import {
    createProduct,
    deleteProduct,
    updateProduct,
    bulkCreateProducts,
    bulkDeleteProducts,
    updateProductStock,
    updateProductDiscount,
    toggleFloristPick,
    toggleNewProduct,
    getAllProductsAdmin
} from '../controllerS/admin/products.js';

import { updateOrderStatus } from '../controllerS/admin/orders.js';


const adminRouter = express.Router();
adminRouter.use(verifyAdmin);

// product management
adminRouter.post('/products/create', createProduct);
adminRouter.get('/products/all', getAllProductsAdmin);
adminRouter.put('/products/:productId', updateProduct);
adminRouter.delete('/products/:productId', deleteProduct);

// bulk operations
adminRouter.post('/products/bulk', bulkCreateProducts);
adminRouter.delete('/products/bulk', bulkDeleteProducts);

// product updates
adminRouter.patch('/products/:productId/stock', updateProductStock);
adminRouter.patch('/products/:productId/discount', updateProductDiscount);
adminRouter.patch('/products/:productId/florist-pick', toggleFloristPick);
adminRouter.patch('/products/:productId/new', toggleNewProduct);

// order management
adminRouter.patch('/orders/:id/:orderId', updateOrderStatus)


export default adminRouter