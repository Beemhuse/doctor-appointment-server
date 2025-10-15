import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctor Appointment Booking API',
      version: '1.0.0',
      description: 'API documentation for the Doctor Appointment Booking System',
    },
    servers: [
      {
        url: 'http://localhost:4000/', // 👈 your base path here
        description: 'Local development server',
      },
      {
        url: 'https://doctor-appointment-server-jm1p.onrender.com/', // optional production base path
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
