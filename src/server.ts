import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import MainRouter from "./routes";
import rateLimit from "express-rate-limit";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import ProductRouter from "./routes/product";
import CategoryRouter from "./routes/categories";
import AuthMiddleware from "./middleware/auth.middleware";
import expressListEndpoints from "express-list-endpoints";
import DocumentRouter from "./routes/document";
import ResetPasswordRouter from "./routes/reset_password.route";

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
    const authMiddleware = new AuthMiddleware().checkAuth;
    // Setup common security protection (Helmet should come first)
    this.expressInstance.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );

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
    this.expressInstance.use("/", authMiddleware);
    // Setup requests gZip compression (Should be the last middleware)
    this.expressInstance.use(compression());
  }

  private routesSetup() {
    // Instantiate mainRouter object
    const router = new MainRouter().router;
    const authRouter = new AuthRouter().router;
    const userRouter = new UserRouter().router;
    const productRouter = new ProductRouter().router;
    const categoryRouter = new CategoryRouter().router;
    const documentRouter = new DocumentRouter().router;
    const resetPasswordRouter = new ResetPasswordRouter().router;


    // Add to server routes
    this.expressInstance.use("/", router);
    this.expressInstance.use("/api/auth", authRouter);
    this.expressInstance.use("/api/user", userRouter);
    this.expressInstance.use("/api/product", productRouter);
    this.expressInstance.use("/api/categories", categoryRouter);
    this.expressInstance.use("/api/document", documentRouter);
    this.expressInstance.use("/api/reset-password", resetPasswordRouter);

  }

  private printRegisteredRoutes() {
    console.log(`\n`);

    function printLog(method: string, path: string) {
      console.log(
        `${FgYellow}Registered route: ${FgGreen}${method} ${path}` + Reset
      );
    }
    const routes = expressListEndpoints(this.expressInstance);
    routes.forEach((route: any) => {
      if (route.methods.length > 1) {
        route.methods.forEach((method: string) => {
          printLog(method, route.path);
        });
      } else {
        printLog(route.methods[0], route.path);
      }
    });
  }
}
