import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
 @IsString()
 nis: string;

 @IsString()
 name: string;

 @IsOptional()
 @IsEmail()
 email?: string;

 @IsString()
 kelas: string;

 @IsString()
 jurusan: string;
}
