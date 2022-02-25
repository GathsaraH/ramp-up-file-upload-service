import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { extname } from 'path';
import { UpdateFileDto } from './dto/update-file.dto';
import { Request } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
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

  // @Post()
  // @UseInterceptors(FileInterceptor('filename', { dest: './uploads' }))
  // async upload(@UploadedFile() files: Express.Multer.File) {
  //   console.log(files);
  //   const data = fs.createReadStream(files.buffer.toString(), 'utf8');
  //   if (data) {
  //     console.log(data);
  //   }
  // }

  // @UseInterceptors(AnyFilesInterceptor())
  // uploadFile(
  //   @UploadedFiles() files: Express.Multer.File,
  //   @Body() createFileDto: CreateFileDto,
  //   @Req() request: Request,
  // ) {
  //   console.log(files);
  //   const data = fs.createReadStream(files[0].buffer.toString(), 'utf8');
  //   console.log(data.path);
  // }

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
