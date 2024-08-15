import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      message: "Api is working fine & Health 100%"
    };
  }
}
