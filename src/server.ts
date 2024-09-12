import express from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./docs/swagger.json"; // Adjust path based on the src directory
import { RegisterRoutes } from "./routes/v1/routes";
import dotenv from "dotenv";
import connectToMongoDB from "./database/connection";
import configs from "./config";

dotenv.config()

const app = express();

app.use(express.json());

// Serve Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register TSOA routes
RegisterRoutes(app);

// Start the server
async function run() {
  try {
    await connectToMongoDB()
    app.listen(configs.port, () => {
      console.log(`server running port ${configs.port}`);
      console.log("----------------------------------------------------")
    })
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}

run();
