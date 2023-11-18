import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import __dirname from "../utils.js";
const swaggerOptions = {
    definition: {
        openapi:"3.0.1",
      info: {
        title: 'Proyecto Final Backend de Coderhouse',
        description: '...',
      },
    },
    apis: [ __dirname+'/swagger/docs/*.yaml'], 
  };
  
const swaggerSpec = swaggerJSDoc(swaggerOptions);
export {swaggerSpec,swaggerUi}