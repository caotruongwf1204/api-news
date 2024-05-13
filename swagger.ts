import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for API endpoints',
    },
    servers: [
      {
        url: "http://localhost:3000/"
      }
    ],
  },
  apis: ['./openapi/*.yaml'], // Path to the API specification
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
