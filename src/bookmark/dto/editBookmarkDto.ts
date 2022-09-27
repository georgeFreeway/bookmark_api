/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class EditBookmarkDto {
    @IsString()
    @IsOptional()
    title?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    link?: string
}