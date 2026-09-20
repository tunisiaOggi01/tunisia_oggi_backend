import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import { LoginDto, RegisterDto, UpdateProfileDto, HeardAboutDto } from '../dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/password-reset.dto';
export declare class AuthController {
    private authService;
    private refreshTokenService;
    constructor(authService: AuthService, refreshTokenService: RefreshTokenService);
    private setCookies;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
            imageUrl: any;
            description: any;
            profileCompleted: any;
            heardAbout: any;
        };
        csrfToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
            imageUrl: any;
            description: any;
            profileCompleted: any;
            heardAbout: any;
        };
    }>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    updateHeardAbout(user: any, dto: HeardAboutDto): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    me(user: any, req: Request): Promise<{
        user: {
            id: any;
            email: any;
            username: any;
            role: any;
            imageUrl: any;
            description: any;
            profileCompleted: any;
            heardAbout: any;
        };
        csrfToken: any;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        csrfToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        success: boolean;
    }>;
}
