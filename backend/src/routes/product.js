import express from 'express'

const productRoutes = express.Router();

import { popular, boquets, flowers} from '../controller/product.js'

productRoutes.get('/popular', popular)
productRoutes.get('/boquets', boquets)
productRoutes.get('/flowers', flowers)
productRoutes.get('/floristPicks', floristPicks)
productRoutes.get('/new', newProducts)

export default productRoutes