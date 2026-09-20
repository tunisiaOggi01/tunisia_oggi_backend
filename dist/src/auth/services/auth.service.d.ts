import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshTokenService } from './refresh-token.service';
import { OtpService } from './otp.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private refreshTokenService;
    private otpService;
    constructor(prisma: PrismaService, jwtService: JwtService, refreshTokenService: RefreshTokenService, otpService: OtpService);
    mapUser(user: any): {
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    };
    validateAndLogin(email: string, password: string): Promise<{
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
        token: string;
        csrfToken: string;
        refreshToken: string;
    }>;
    register(email: string, username: string, password: string): Promise<{
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
    updateProfile(userId: string, data: {
        imageUrl?: string;
        description?: string;
    }): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    updateHeardAbout(userId: string, source: string): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    getProfile(userId: string): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, otpCode: string, newPassword: string): Promise<void>;
    handleGoogleLogin(profile: {
        googleId: string;
        email: string;
        username: string;
        imageUrl: string | null;
    }): Promise<{
        id: string;
        email: string;
        username: string;
        googleId: string | null;
        passwordHash: string | null;
        imageUrl: string | null;
        description: string | null;
        profileCompleted: boolean;
        heardAbout: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    issueTokens(userId: string, user: {
        email: string;
        username: string;
        role: string;
    }): Promise<{
        token: string;
        csrfToken: string;
        refreshToken: string;
    }>;
    changeUsername(userId: string, username: string): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    changeEmail(userId: string, email: string): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
