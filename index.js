require("dotenv").config();

const express = require("express");
const dbConnection = require("./config/database");
const { typeError } = require("./middleware/errors");

const app = express();

const PORT = process.env.PORT || 3000;

const runServer = async () => {
  await dbConnection();

  app.listen(PORT, () => console.log(`Server listening to port ${PORT}...`));
};

app.use(express.json());
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));
app.use("/comments", require("./routes/comments"));

app.use(typeError);

runServer();
