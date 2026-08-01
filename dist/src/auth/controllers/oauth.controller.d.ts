import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
export declare class OAuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService);
    google(): void;
    googleCallback(req: Request, res: Response, redirect?: string): Promise<void>;
}
