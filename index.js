require("dotenv").config();

const express = require("express");
const dbConnection = require("./config/database");
const { typeError } = require("./middleware/errors");

const app = express();

const runServer = async () => {
  await dbConnection();

  app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server listening to port ${process.env.SERVER_PORT}...`)
  );
};

app.use(express.json());
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.use(typeError);

runServer();
