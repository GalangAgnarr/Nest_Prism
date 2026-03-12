import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto {
 @IsOptional()
 @IsString()
 nis?: string;

 @IsOptional()
 @IsString()
 name?: string;

 @IsOptional()
 @IsEmail()
 email?: string;

 @IsOptional()
 @IsString()
 kelas?: string;

 @IsOptional()
 @IsString()
 jurusan?: string;
}
