import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import MainRouter from "./routes";
import rateLimit from "express-rate-limit";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import AuthMiddleware from "./middleware/auth.middleware";
import expressListEndpoints from "express-list-endpoints";

const Reset = "\x1b[0m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";

export default class Server {
  expressInstance: express.Express;

  constructor() {
    this.expressInstance = express();
    this.middlewareSetup();
    this.routesSetup();
    this.printRegisteredRoutes();
  }

  private middlewareSetup() {
    // Setup common security protection (Helmet should come first)
    this.expressInstance.use(helmet());

    // Setup Cross Origin access (CORS can be configured as needed)
    this.expressInstance.use(cors());
    this.expressInstance.use(
      "/api",
      rateLimit({
        windowMs: 1 * 1000,
        max: 10,
      })
    );
    // Setup requests format parsing (BodyParser should come before other routes)
    this.expressInstance.use(bodyParser.urlencoded({ extended: true }));
    this.expressInstance.use(bodyParser.json());
    this.expressInstance.use("/", new AuthMiddleware().checkAuth);
    // Setup requests gZip compression (Should be the last middleware)
    this.expressInstance.use(compression());
  }

  private routesSetup() {
    // Instantiate mainRouter object
    const router = new MainRouter().router;
    const authRouter = new AuthRouter().router;
    const userRouter = new UserRouter().router;

    // Add to server routes
    this.expressInstance.use("/", router);
    this.expressInstance.use("/api/auth", authRouter);
    this.expressInstance.use("/api/user", userRouter);
  }

  private printRegisteredRoutes() {
    const routes = expressListEndpoints(this.expressInstance);
    console.log(`\n`);
    routes.forEach((route) => {
      console.log(
        `${FgYellow}Registered route: ${FgGreen}${route.path}` + Reset
      );
    });
  }
}
