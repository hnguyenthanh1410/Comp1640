import { IsNotEmpty, IsNumber } from 'class-validator';

export class CodeRequest {
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
