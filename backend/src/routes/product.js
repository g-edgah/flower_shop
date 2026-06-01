import express from 'express'

const productRouter = express.Router();

import { popular, bouquets, flowers, floristPicks, newProducts} from '../controller/user/product.js'

productRouter.post('/popular', popular)
productRouter.post('/bouquets', bouquets)
productRouter.post('/flowers', flowers)
productRouter.get('/floristPicks', floristPicks)
productRouter.get('/new', newProducts)

export default productRouter