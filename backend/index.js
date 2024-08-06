var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var Review = require("./schema/review");
const http = require("http");

const { Server } = require("socket.io");

var app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

mongoose.connect("mongodb://127.0.0.1:27017/live_review");
mongoose.connection
  .on("error", function (error) {
    if (error) console.log("connection error", error);
  })
  .once("open", function (args) {
    console.log("connected successfully.");
  });

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.post("/added", async (req, res) => {
  try {
    console.log("payload:>", req.payload);
    const review = await Review.create({ ...req.body });
    console.log({ review });
    if (review) {
      //   broadcast({ type: 'added', review });
      io.emit("ADD_ITEM", review);
      res.status(201).send({ msg: "Review Added" });
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
app.get("/getReview", async (req, res) => {
  try {
    const reviewData = await Review.find();
    console.log({ reviewData });
    if (reviewData) {
      // broadcast({ type: 'fetch', reviewData });
      res.send(reviewData);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.put("/edited/:id", async (req, res) => {
  try {
    var updatedReview = await Review.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: req.body?.title,
        content: req.body?.content,
        date_time: req.body?.date_time,
      },
      {
        new: true,
      }
    );
    console.log({ updatedReview });

    if (updatedReview) {
      io.emit("EDIT_ITEM", updatedReview);
      res.status(200).send(updatedReview);
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.delete("/deleted/:id", async function (req, res) {
  console.log(req.params.id);

  try {
    var deletedReview = await Review.findByIdAndDelete({ _id: req.params.id });
    console.log({ deletedReview });
    if (deletedReview) {
      io.emit("DELETE_ITEM", deletedReview);
      res.status(200).send({ msg: "REVIEW DELETED" });
    } else res.status(404).send("error in deleting");
  } catch (error) {
    res.send(error);
  }
});

server.listen(3001, function (error) {
  if (error) console.log("error in connect to server", error);
  console.log("server connected successfully on port 3001");
});
