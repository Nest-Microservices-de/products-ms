import { ArgumentsHost, Catch, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

/**Manejador de excepciones el cual funcionara de forma global*/
@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException>{
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
        return throwError(()=> exception.getError());
    }
}