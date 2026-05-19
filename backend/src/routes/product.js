import express from 'express'

const productRouter = express.Router();

import { popular, bouquets, flowers, floristPicks, newProducts} from '../controller/product.js'

productRouter.get('/popular', popular)
productRouter.get('/bouquets', bouquets)
productRouter.get('/flowers', flowers)
productRouter.get('/floristPicks', floristPicks)
productRouter.get('/new', newProducts)

export default productRouter