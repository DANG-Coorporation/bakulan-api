import { Request, Response } from "express";
import { DocumentService } from "../service/document.service";
import { ProcessError } from "../helper/Error/errorHandler";

export class DocumentController {
  documentService: DocumentService;

  constructor() {
    this.documentService = new DocumentService();
  }

  async uploadDocument(req: Request, res: Response) {
    try {
      const result = await this.documentService.uploadDocument(req.file!);
      res.status(200).json({
        message: "File uploaded successfully",
        data: result,
      });
    } catch (error) {
      ProcessError(error, res);
    }
  }
}
