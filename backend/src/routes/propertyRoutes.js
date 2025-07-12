const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validate = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties
} = require('../controllers/propertyController');

// 검증 스키마
const createPropertySchema = Joi.object({
  basicInfo: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('house', 'condo', 'village').required(),
    region: Joi.string().required(),
    address: Joi.string().required(),
    price: Joi.number().positive().required(),
    currency: Joi.string().default('PHP'),
    deposit: Joi.number().min(0).default(0)
  }).required(),
  details: Joi.object({
    bedrooms: Joi.number().min(0).required(),
    bathrooms: Joi.number().min(0).required(),
    area: Joi.number().positive().required(),
    floor: Joi.number().min(0),
    furnished: Joi.boolean().default(false),
    amenities: Joi.array().items(Joi.string())
  }).required(),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().required(),
    landmark: Joi.string(),
    city: Joi.string().required(),
    province: Joi.string().required()
  }).required(),
  contact: Joi.object({
    whatsapp: Joi.string(),
    telegram: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    contactName: Joi.string()
  }),
  images: Joi.array().items(Joi.object({
    url: Joi.string().required(),
    thumbnailUrl: Joi.string().required(),
    alt: Joi.string(),
    order: Joi.number().default(0),
    isMain: Joi.boolean().default(false)
  })),
  translations: Joi.object({
    ko: Joi.object({
      title: Joi.string(),
      description: Joi.string()
    }),
    zh: Joi.object({
      title: Joi.string(),
      description: Joi.string()
    }),
    ja: Joi.object({
      title: Joi.string(),
      description: Joi.string()
    }),
    en: Joi.object({
      title: Joi.string(),
      description: Joi.string()
    })
  })
});

// Public 라우트
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/:id', getProperty);

// Admin 라우트
router.post(
  '/',
  protect,
  authorize('admin', 'super_admin'),
  validate(createPropertySchema),
  createProperty
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'super_admin'),
  updateProperty
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'super_admin'),
  deleteProperty
);

module.exports = router;