import { EmailField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RequireResetPasswordResDto {
  @Expose()
  @EmailField()
  email!: string;
}
