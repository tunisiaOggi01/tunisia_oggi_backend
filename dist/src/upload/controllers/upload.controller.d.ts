import { UploadService } from '../services/upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    upload(file: Express.Multer.File, user: any): Promise<{
        url: string;
    }>;
}
