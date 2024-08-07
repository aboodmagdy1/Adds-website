import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async upload_s3(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'text/plain' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.upload(file.originalname, file.buffer);
  }

  // --------------------------------same field name ---------------------------------------
  @Post('local-m')
  @UseInterceptors(FilesInterceptor('files'))
  async upload_local_m(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return files;
  }

  @Post('local')
  @UseInterceptors(FileInterceptor('file'))
  async upload_local(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'File  must be at most 1024 bytes',
          }),
          new FileTypeValidator({ fileType: /png|jpg|pdf|text/ }),
        ],
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: (error: string) => {
          if (error.includes('expected type')) {
            throw new UnprocessableEntityException('File type not supported');
          }
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }

  // --------------------------------different field name ---------------------------------------
  @Post('local-d')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cvs', maxCount: 2 },
      { name: 'note', maxCount: 1 },
    ]),
  )
  uploadFiles_local(
    @UploadedFiles()
    files: {
      CVS?: Express.Multer.File[];
      note?: Express.Multer.File;
    },
  ) {
    return files;
  }
}
