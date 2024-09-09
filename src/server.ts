import express from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./docs/swagger.json"; // Adjust path based on the src directory
import { RegisterRoutes } from "./routes/v1/routes";
import dotenv from "dotenv";
import connectDB from "./configs/database";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
connectDB();

// Serve Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register TSOA routes
RegisterRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
