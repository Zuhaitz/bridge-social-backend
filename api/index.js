require("dotenv").config();

const express = require("express");
const dbConnection = require("../config/database");
const { typeError } = require("../middleware/errors");

const app = express();
const PORT = process.env.PORT || 3000;

const runServer = async () => {
  await dbConnection();

  app.listen(PORT, () => console.log(`Server listening to port ${PORT}...`));
};

const cors = require("cors");
const corsOptions = {
  // origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/users", require("../routes/users"));
app.use("/api/posts", require("../routes/posts"));
app.use("/api/comments", require("../routes/comments"));

app.use(typeError);

runServer();
