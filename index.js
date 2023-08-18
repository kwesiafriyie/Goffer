import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import goferRoutes from './routes/gofers.js'
import hirerRoutes from './routes/hirers.js'



const app = express();
const PORT = process.env.PORT||3000;
dotenv.config();
app.use(bodyParser.json());

//imporst routes
app.use("/gofers", goferRoutes);
app.use("/hirers", hirerRoutes);


mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
    // Your code here
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.get("/gofers", (req, res) => {
  res.send("We are gofers home now!");
});

app.get("/hirers", (req, res) => {
  res.send("We are hirers home now!");
});

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});
