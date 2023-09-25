const express = require('express');
const router = express.Router();
const prodController = require('../controllers/productionController');
router.post('/addProduct', prodController.create);

router.patch('/:id/updateProduct', prodController.update);
router.delete('/:id/deleteProduct', prodController.remove);
router.get('/:id/getbyId', prodController.readById);
router.get('/getAll', prodController.readAll);

module.exports = router;
