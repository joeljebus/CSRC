const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authroutes");
const profileRoutes = require("./routes/profileroutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/uploads",

  express.static("uploads"),
);
app.use("/api/auth", authRoutes);
app.use(
  "/api/profile",

  profileRoutes,
);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
