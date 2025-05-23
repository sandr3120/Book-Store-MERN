import express from "express";
import { PORT, uri } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

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

app.use(express.json());

//Default API
app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send(`Welcome to Book Store`);
});

//Adding Books to MongoDB
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({ message: "Specify all fields: title, author and publishYear" });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Getting All Books from MongoDB
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Getting Book by ID from MongoDB
app.get("/books/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Updating Books By ID
app.put("/books/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response
        .status(400)
        .send({ message: "Specify all fields: title, author and publishYear" });
    }

    const { id } = request.params;
    const result = await Book.findByIdAndUpdate(id, request.body);
    if(!result){
        return response.status(404).send({message:'Book Not Found'});
    }
        return response.status(200).send({message:'Book Updated Successfully'});

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
