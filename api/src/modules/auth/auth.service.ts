import { UserService } from '@modules/user/user.service';
import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto, SignUpResponse } from './dto/sign-up.dto';
import { TokenPayload } from './interfaces/token.interface';
import { access_token_private_key, refresh_token_private_key } from '@constants/jwt.constraints';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { isBefore } from 'date-fns';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private readonly UserService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }
  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    try {
      const existedUser = await this.UserService.findOneByCondition(signUpDto.email);
      if (existedUser) {
        throw new ConflictException('Email already existed!!');
      }

      const hashedPassword = await bcrypt.hash(
        signUpDto.password,
        this.SALT_ROUND,
      );
      const user = await this.UserService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });
      const refreshToken = this.generateRefreshToken({
        userId: user.id.toString(),
      });
      await this.storeRefreshToken(user.id.toString(), refreshToken);
      return {
        accessToken: this.generateAccessToken({
          userId: user.id.toString(),
        }),
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(userId: string) {
    try {
      const access_token = this.generateAccessToken({
        userId,
      });
      const refresh_token = this.generateRefreshToken({
        userId,
      });
      await this.storeRefreshToken(userId, refresh_token);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.UserService.findOneByCondition(email);
      // if (user?.blockTo && isBefore(new Date(), user.blockTo)) {
      //   throw new BadRequestException(
      //     'This user be blocked by admin, please contact admin to unlock',
      //   );
      // }
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException(
        error?.response?.message || 'Wrong credentials!!',
      );
    }
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException();
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    try {
      const hashedToken = await bcrypt.hash(token, this.SALT_ROUND);
      await this.UserService.setCurrentRefreshToken(userId, hashedToken);
    } catch (error) {
      throw error;
    }
  }

}
