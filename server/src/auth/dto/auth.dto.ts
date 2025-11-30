import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email не должен быть пустым' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @Length(8, 32, { message: 'Пароль должен быть от 8 до 32 символов' }) // Для простоты, валидация пароля только по длине, так бы использовал @Matches()
  password: string;
}
