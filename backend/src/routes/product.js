import express from 'express'

const productRoutes = express.Router();

import { popular, bouquets, flowers, floristPicks, newProducts} from '../controller/product.js'

productRoutes.get('/popular', popular)
productRoutes.get('/bouquets', bouquets)
productRoutes.get('/flowers', flowers)
productRoutes.get('/floristPicks', floristPicks)
productRoutes.get('/new', newProducts)

export default productRoutes