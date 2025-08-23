// src/storage/storage.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  Get,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import type { File } from 'multer';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: File) {
    const url = await this.storageService.uploadFile(file);
    return { url };
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = await this.storageService.getFileStream(filename);
    if (!fileStream) {
      throw new NotFoundException('File not found');
    }
    fileStream.pipe(res);
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    return this.storageService.deleteFile(filename);
  }
}
