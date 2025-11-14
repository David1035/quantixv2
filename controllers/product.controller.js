// routes/products.route.js
const express = require('express');
const ProductService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema
} = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductService();

// Crear (201 + Location)
router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body; // { name, salePrice, categoryId, stock? }
      const newProduct = await service.create(body);
      // newProduct.id debe existir tras create
      res
        .status(201)
        .location(`/products/${newProduct.id}`)
        .json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

// Listar
router.get('/',
  async (req, res, next) => {
    try {
      // si luego quieres paginación: ?limit=&offset=
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Detalle
router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar total (PUT) – compatibilidad con front
router.put('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body; // puede incluir stock con número o null
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Actualización parcial (PATCH) – mantén soporte
router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar (204 No Content)
router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(204).send(); // sin body
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
