import { IsInt, IsDateString } from 'class-validator';

export class CreateLoanDto {
  @IsInt()
  studentId: number;

  @IsInt()
  bookId: number;

  @IsDateString()
  dueDate: string;
}
