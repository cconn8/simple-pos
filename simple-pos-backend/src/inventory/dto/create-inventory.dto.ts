import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  qty?: number;

  @IsString()
  @IsOptional()
  isBillable?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
