import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { extname } from 'path';
import { UpdateFileDto } from './dto/update-file.dto';
import {  FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('files')
export class FilesController {
  constructor(
    @InjectQueue('upload-queue') private fileQueue: Queue,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: './csv',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadCsv(@UploadedFile() file) {
    return await this.filesService.create(file);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
