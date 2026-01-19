import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsIn(['OPEN', 'IN PROGRESS', 'DONE'])
  status?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
