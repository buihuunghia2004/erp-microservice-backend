import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpException, Inject, NotFoundException, Post, Query, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { ClientTCP, RpcException } from '@nestjs/microservices';
import { first, firstValueFrom } from 'rxjs';
import { RequireResetPasswordResDto } from './dto/require-reset-password.req.dto';
import { reset_password_template } from 'src/public/template/reset-password-template';
import { SubmitResetPasswordResDto } from './dto/submit-reset-password.req.dto';
import { HttpStatusCode } from 'axios';
import { STATUS_CODES } from 'http';
import { Response } from 'express';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userService: ClientTCP,

  ) {}

  @ApiPublic({
    type: RequireResetPasswordResDto,
    summary: 'Require reset password',
  })
  @HttpCode(HttpStatusCode.Accepted)
  @Post('email/require-resset-password')
  async requireResetPassword(
    @Body() body: RequireResetPasswordResDto,
    @Res() res: Response 
  ){
      try {
        const msg = await firstValueFrom(this.userService.send({ cmd: 'require_reset_password' }, body))
        return res.status(202).send(msg);
      } catch (error) {
        throw new RpcException(error)
      }
  }

  // @ApiPublic({
  //   type: LoginResDto,
  //   summary: 'Sign in',
  // })
  // @Post('email/login')
  // async signIn(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
  //   return await this.authService.signIn(userLogin);
  // }

  // @ApiPublic()
  // @Post('email/register')
  // async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
  //   return await this.authService.register(dto);
  // }

  // @ApiAuth({
  //   summary: 'Logout',
  //   errorResponses: [400, 401, 403, 500],
  // })
  // @Post('logout')
  // async logout(@CurrentUser() userToken: JwtPayloadType): Promise<void> {
  //   await this.authService.logout(userToken);
  // }

  // @ApiPublic({
  //   type: RefreshResDto,
  //   summary: 'Refresh token',
  // })
  // @Post('refresh')
  // async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
  //   return await this.authService.refreshToken(dto);
  // }

  // @ApiPublic()
  // @Post('forgot-password')
  // async forgotPassword(
  //   @Query('email') email: string
  // ) {
  //   return await firstValueFrom(this.userService.send({cmd: 'forgot-password'}, {email}));
  // }

  // @ApiPublic()
  // @Post('verify/forgot-password')
  // async verifyForgotPassword() {
  //   return 'verify-forgot-password';
  // }

  @ApiPublic()
  @Post('email/reset-password')
  async resetPassword(
    @Body() body: SubmitResetPasswordResDto
  ) {
    return await this.userService
    .send({ cmd: 'submit_reset_password' }, body)
    .toPromise();
  }

  @ApiPublic()
  @Get('email/reset-password')
  async verifyEmail(
    @Query('token') token: string
  ) {
    return reset_password_template
  }

  // @ApiPublic()
  // @Post('verify/email/resend')
  // async resendVerifyEmail() {
  //   return 'resend-verify-email';
  // }
}
