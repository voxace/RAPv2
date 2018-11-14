const config = require("./config");
const Koa = require("koa");
const cors = require("@koa/cors");
const routes = require("./routes");
const logger = require("koa-logger");
var bodyParser = require("koa-body");
const mongoose = require("mongoose");

const app = new Koa();
app.use(cors());

//Set up body parsing middleware
app.use(
  bodyParser({
    formidable: { uploadDir: "./uploads" }, //This is where the files would come
    multipart: true,
    urlencoded: true
  })
);

// Connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo.connection);
mongoose.connection
  .once("open", function() {
    console.log("Mongodb Connection made");
  })
  .on("error", function() {
    console.log("Connection error", error);
  });

// Enable logger
app.use(logger());

// Error Handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
});

app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(3001, () => {
  console.log(`API server listening on ${config.port}, in ${config.env} mode`);
});
