import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Logs } from 'src/Entities/logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResponseService {
  constructor(
    @InjectRepository(Logs) private readonly _logs: Repository<Logs>,
  ) {}

  generateResponse(code: any, msg: string, data: any, req: Request) {
    try {
      const { originalUrl } = req;

      const payload = {
        message: msg,
        isError: false,
        route: originalUrl,
        status_code: code,
        http_method: req.method,
      };
      const createLog = this._logs.create(payload);
      this._logs.save(createLog);

      if (code != 200) {
        throw new HttpException(msg, code);
      }

      return {
        code: code,
        message: msg,
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  generateError(error, req?: Request) {
    try {
      const { originalUrl } = req;

      const payload = {
        message: error.message,
        isError: true,
        route: originalUrl,
        status_code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        http_method: req.method,
      };

      const createLog = this._logs.create(payload);
      this._logs.save(createLog);

      throw new HttpException(error.message, error.status);
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
