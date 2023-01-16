import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";
import { UserDto } from "src/users/dto/user.dto";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize (dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        // Run something before the a request is handled
        // by the request handler

        console.log("I'm running before the handler", context)
        return next.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }

}