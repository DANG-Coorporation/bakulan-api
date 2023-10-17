import { extname } from "path";
import Document from "../database/models/document";
import MinioService from "./minio.service";
import * as uuid from "uuid";
import configConstants from "../config/constants";
export class DocumentService {
  minioService: MinioService;

  constructor() {
    this.minioService = new MinioService();
  }

  async uploadDocument(file: Express.Multer.File) {
    try {
      const extension = extname(file.originalname);
      const pathName = `images/${uuid.v4()}${extension}`;

      await this.minioService.uploadFile(
        file,
        pathName,
        configConstants.BUCKET_NAME
      );
      const document = await Document.create({
        bucketname: configConstants.BUCKET_NAME,
        filename: file.originalname,
        pathname: pathName,
        type: "image",
      });
      return document;
    } catch (error) {
      throw error;
    }
  }
}
