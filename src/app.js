import express from "express";
import path from "path";
import cors from "cors";
import passport from "passport";
import userAgent from "express-useragent";
import compression from "compression";
import { capture } from "express-device";
import { configurePassport } from "./config/passport";
import { sequelize } from "./models";
import routes from "./routes";
import { handleErrors } from "./middlewares";
import { allowedOrigins, corseOptions, security } from "./config/security";
import { appSocket } from "./config/socketIo";
import { session } from "./config/session";
import { dbBackup } from "./crons";
import { dbConnectFail } from "./helpers";
import "dotenv/config";

const app = express();

app.use(cors(corseOptions));
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer.replace(/\/$/, "");

  if (allowedOrigins.includes(origin)) {
    res.setHeader("X-Frame-Options", `ALLOW-FROM ${origin}`); // Change accordingly
    res.setHeader(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${origin}`,
    );
  }
  next();
});
app.use(capture());
app.use(userAgent.express());
app.set("trust proxy", true);
security(app);
/**
 * Check database connection before running the app
 */
sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch(dbConnectFail);

const buildDir = `build${process.env.NODE_ENV === "staging" ? "-staging" : ""}`;
app.use(compression());
app.use(
  express.urlencoded({
    limit: "100mb",
    parameterLimit: 100000,
    extended: false,
  }),
);
app.use(express.json({ limit: "100mb" }));
app.use(express.static(buildDir));
app.use("/songs", express.static("public/songs"));
app.use("/images", express.static("public/images"));
app.use("/covers", express.static("public/books/bookCovers"));
/**
 * Initialize passport and session
 */
app.use(session());
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
/**
 * App routes
 */
app.use("/api", routes);
/**
 * Catch unexpected errors from the API
 */
app.use(handleErrors);
/**
 * The frontend/cLient
 */
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(buildDir, "index.html"));
});
/**
 * Configure socket
 */
appSocket(app);
/**
 * Backup database
 */
if (process.env.NODE_ENV === "production") {
  dbBackup();
}

export default app;
