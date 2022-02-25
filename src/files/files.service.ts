import { Injectable } from '@nestjs/common';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}
  async create(file: any): Promise<string[]> {
    console.log(file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const csv = require('csvtojson');
    const csvFilePath = process.cwd() + '/' + file.path;
    const studentArray = await csv().fromFile(csvFilePath);
    let students;
    try {
      students = await this.fileRepository.save(studentArray);
    } catch (error) {
      students = null;
    }
    return students;
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
