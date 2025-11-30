import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Название не должен быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  @Length(1, 32, { message: 'Название должно быть от 1 до 32 символов' })
  title: string;

  @IsNotEmpty({ message: 'Описание не должен быть пустым' })
  @IsString({ message: 'Описание должно быть строкой' })
  @Length(1, 128, { message: 'Описание должно быть от 1 до 128 символов' })
  description: string;
}