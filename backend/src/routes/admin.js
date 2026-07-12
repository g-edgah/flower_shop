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
} from '../controllers/admin/products.js';
import {
    addCountryRegions,
    removeCountryRegions,
    editCountryRegion,
    addRegionCities,
    addMultipleRegionCities,
    removeRegionCities,
    editRegionCity
} from '../controllers/admin/address.js'

import { updateOrderStatus } from '../controllers/admin/orders.js';


const adminRouter = express.Router();
adminRouter.use(verifyAdmin);

// product management
adminRouter.post('/products/create', createProduct);
adminRouter.get('/products/all', getAllProductsAdmin);
adminRouter.post('/products/edit/:productId', updateProduct);
adminRouter.post('/products/delete/:productId', deleteProduct);

// bulk operations
adminRouter.post('/products/create/bulk', bulkCreateProducts);
adminRouter.post('/products/delete/bulk', bulkDeleteProducts);

// product updates
adminRouter.post('/products/:productId/stock', updateProductStock);
adminRouter.post('/products/:productId/discount', updateProductDiscount);
adminRouter.post('/products/:productId/florist-pick', toggleFloristPick);
adminRouter.post('/products/:productId/new', toggleNewProduct);

// order management
adminRouter.post('/orders/:id/:orderId', updateOrderStatus)

//address management
adminRouter.post('/address/add/country', addCountryRegions);
adminRouter.post('/address/remove/country', removeCountryRegions);
adminRouter.post('/address/edit/contry', editCountryRegion);
adminRouter.post('/address/add/region', addMultipleRegionCities);
adminRouter.post('/address/remove/region', removeRegionCities);
adminRouter.post('/address/edit/contry', editRegionCity);

export default adminRouter