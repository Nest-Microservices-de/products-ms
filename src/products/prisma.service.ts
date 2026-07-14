import { Injectable} from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { envs } from "src/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService  extends PrismaClient {

    constructor(){
        const adapter = new PrismaBetterSqlite3({url: envs.DATABASE_URL});
        super({adapter});
    }

}