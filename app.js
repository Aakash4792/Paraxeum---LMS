const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const authController = require("./controllers/authController");
const User = require("./models/User");
const multer = require("multer");
const port = 5000;
var bodyParser = require("body-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const lessonsRouter = require("./routes/lessonRoutes");
const taskRouter = require("./routes/taskRoutes");

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://aakashsivakumar:25340210Mongodb!@cluster0.nlayw.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client
//   .connect(uri)
//   .then((result) =>
//     app.listen(process.env.PORT || port, () => {
//       console.log("listening...");
//     })
//   )
//   .catch((err) => console.error(err));

const dbURI =
  "mongodb+srv://aakashsivakumar:zX9qmhvjCk0PI1xT@cluster0.nlayw.mongodb.net/lms-final-project?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) =>
    app.listen(process.env.PORT || port, () => {
      console.log("listening...");
    })
  )
  .catch((err) => console.log(err));

//middleware
app.use(express.static("public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cookieParser());

app.set("view engine", "ejs");

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.get("*", checkUser);
app.get("/homepage", requireAuth, checkUser, (req, res) =>
  res.render("homepage")
);
app.get("/dashboard", requireAuth, checkUser, (req, res) =>
  res.render("dashboard")
);
app.post(
  "/dashboard",
  requireAuth,
  checkUser,
  upload.single("image"),
  authController.dashboard_post
);
app.use(authRouter);
app.use(requireAuth, lessonsRouter);
app.use(requireAuth, taskRouter);
