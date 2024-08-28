import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{

    constructor(private readonly configService: ConfigService){}

    use(req: Request, res: any, next: (error?: Error | any) => void) {
        console.log(`Request Url: ${req.method}: http://${this.configService.get('NODE_HOST')}:${this.configService.get('PORT')}${req.originalUrl}`);
        next();
    }

}