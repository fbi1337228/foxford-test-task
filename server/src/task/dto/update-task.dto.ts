import { IsOptional, IsString, Length } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'Название должно быть строкой' })
  @Length(1, 32, { message: 'Название должно быть от 1 до 32 символов' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @Length(1, 128, { message: 'Описание должно быть от 1 до 128 символов' })
  description?: string;
}