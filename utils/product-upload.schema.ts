export const productUploadSchema = {
  description: 'File upload with additional data',
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
      stock: {
        type: 'number',
      },
      category_id: {
        type: 'string',
      },
      brand_id: {
        type: 'string',
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};
