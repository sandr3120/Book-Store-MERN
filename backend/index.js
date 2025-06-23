import express from "express";
import { PORT, uri } from "./config.js";
import mongoose from "mongoose";
import booksRouter from "./routes/booksRoute.js";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/books", booksRouter);

mongoose
  .connect(uri)
  .then(() => {
    console.log(`App connected to database`);
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

//Default API
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Welcome to Book Store`);
});

