import { IsString, IsUUID } from "class-validator";

export class ParamTaskDto {
  @IsString({ message: 'ID задачи должен быть строкой' })
  @IsUUID('4', { message: 'Некорректный формат ID задачи' })
  id: string;
}