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
        url: 'http://localhost:4000/api',
        description: 'Local development server',
      },
      {
        url: 'https://doctor-appointment-server-jm1p.onrender.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { // 👈 match this exactly
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], // 👈 match here too
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
