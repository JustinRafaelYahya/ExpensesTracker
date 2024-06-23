import express, { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import trackerRoutes from "./routes/expenses-route.js";
const app = express();
const PORT = 8000;
const filePath = "./src/data/expenses.json";

app.use(express.json());
app.use("/api/expenses", trackerRoutes);
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
