const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const more = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const ResponseService = require("./services/ResponseService");
const ConstantService = require("./services/ConstantService");

// load config
dotenv.config({ path: "./config/.env" });

// passport config
require("./config/passport")(passport);
connectDB();

const app = express();

app.use(morgan("dev"));

//passport middleware
app.use(passport.initialize());

// file upload
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 50 * 1024 * 1024 },
    })
);


app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// Routes
app.use("/auth", require("./routes/auth"));
app.use("/user", require("./routes/user"));

global.ResponseService = ResponseService;
global.ConstantService = ConstantService;
const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);