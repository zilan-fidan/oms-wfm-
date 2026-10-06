const express = require('express');
const outageController = require('../controllers/outage.controller');
const router = express.Router();

router.get('/', outageController.getAllOutages);
router.get('/:id', outageController.getOutageById);
router.post('/', outageController.createOutage);
router.put('/:id', outageController.updateOutage);
router.delete('/:id', outageController.deleteOutage);

module.exports = router;