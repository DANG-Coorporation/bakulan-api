import { Request, Response, Router } from "express";
import { DocumentController } from "../controllers/document";
import { multerMiddleware } from "../middleware/multer.middleware";

export default class DocumentRouter {
  router: Router;
  documentController: DocumentController;

  constructor() {
    // Initialize controllers objects
    this.documentController = new DocumentController();

    // Initialize router object
    this.router = Router({ mergeParams: true });
    this.userRoutes();
  }

  private userRoutes() {
    this.router.post("/", multerMiddleware, (req: Request, res: Response) =>
      this.documentController.uploadDocument(req, res)
    );
  }
}
