import express from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./docs/swagger.json"; // Adjust path based on the src directory
import { RegisterRoutes } from "./routes/v1/routes";
import dotenv from "dotenv";
import connectToMongoDB from "./database/connection";
import configs from "./config";
import { uploadFile } from './s3'; // Import the uploadFile function correctly

dotenv.config();
const app = express();

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(express.json());

// Serve Swagger UI at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Image upload route
app.post("/image", upload.single("image"), async (req, res) => {
  const file: any = req.file;
  try {
    const result = await uploadFile(file); // Upload the file to S3
    console.log(result);
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file");
  }
});

// Register TSOA routes
RegisterRoutes(app);

// Start the server
async function run() {
  try {
    await connectToMongoDB();
    app.listen(configs.port, () => {
      console.log(`server running port ${configs.port}`);
      console.log(
        "----------------------------------------------------------------"
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

export default app; 