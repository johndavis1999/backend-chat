import { Injectable } from '@nestjs/common';
import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,  // Cambié call$ por next, que es lo que espera la interfaz
  ): Observable<any> {
    return next.handle().pipe(  // Usamos next.handle() para obtener el observable
      map((data) => classToPlain(data)),  // Convierte la clase a un objeto plano
    );
  }
}
