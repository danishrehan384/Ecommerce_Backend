import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {Redis} from 'ioredis';

export class RedisService implements OnModuleInit, OnModuleDestroy{

    private client: Redis;


    onModuleInit() {
       
    }
    onModuleDestroy() {
        throw new Error("Method not implemented.");
    }

}