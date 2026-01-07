import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from '../schemas/funeral.schema';

export class CreateFuneralDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
