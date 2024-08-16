import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: any, next: (error?: Error | any) => void) {
        console.log(`Request Url: ${req.method}: ${req.originalUrl}`);
        next();
    }

}