import { AuthService } from '../services/auth.service';
import { ChangeUsernameDto, ChangeEmailDto, ChangePasswordDto } from '../dto/settings.dto';
export declare class SettingsController {
    private authService;
    constructor(authService: AuthService);
    changeUsername(user: any, dto: ChangeUsernameDto): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    changeEmail(user: any, dto: ChangeEmailDto): Promise<{
        id: any;
        email: any;
        username: any;
        role: any;
        imageUrl: any;
        description: any;
        profileCompleted: any;
        heardAbout: any;
    }>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<void>;
}
