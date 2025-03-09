import { StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SubmitResetPasswordResDto {
  @Expose()
  @StringField()
  token!: string;

  @Expose()
  @StringField({minLength: 6, maxLength: 50})
  password!: string;
}
