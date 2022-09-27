/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Bookmark } from "@prisma/client";
import { GetUser } from "src/auth/decorators";
import { JwtGuard } from "src/auth/guard";
import { BookmarkService } from "./bookmark.service";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('/bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService){}

    @Get()
    getBookmarks(@GetUser('id') userId: number): Promise<Bookmark[]> {
      return this.bookmarkService.getBookmarks(userId);
    }
  
    @Get(':id')
    getBookmarkById(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) bookmarkId: number,
    ): Promise<Bookmark> {
      return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }
  
    @Post()
    createBookmark(
      @GetUser('id') userId: number,
      @Body() createBookmarkDto: CreateBookmarkDto,
    ): Promise<Bookmark> {
      return this.bookmarkService.createBookmark(userId, createBookmarkDto);
    }
  
    @Patch(':id')
    editBookmarkById(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) bookmarkId: number,
      @Body() editBookmarkDto: EditBookmarkDto,
    ): Promise<Bookmark> {
      return this.bookmarkService.editBookmarkById(
        userId,
        bookmarkId,
        editBookmarkDto,
      );
    }
  
    @HttpCode(204)
    @Delete(':id')
    deleteBookmarkById(
      @GetUser('id') userId: number,
      @Param('id', ParseIntPipe) bookmarkId: number,
    ): Promise<void> {
      return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }
}