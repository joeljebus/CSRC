const express = require("express");
const cors = require("cors");
require("dotenv").config();
const facultyRoutes = require("./routes/facultyroutes");
const authRoutes = require("./routes/authroutes");
const profileRoutes = require("./routes/profileroutes");
const app = express();
const endorsementRoutes = require("./routes/endorsementroutes");
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
app.use(
  "/api/faculty",

  facultyRoutes,
);
app.use("/api/endorsements", endorsementRoutes);

  
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
