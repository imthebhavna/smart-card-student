import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if user is logged in and request is to api url
    const user = this.authService.userValue;
    const isLoggedIn = (user != null) && (user.token != null);
    const isValidApiUrl = request.url.startsWith(environment.domain);

    // add Authorization token to every request going from frontend to backend
    if(isLoggedIn && isValidApiUrl) {
      console.log('setting authorization header via Jwt Interceptor ...');
      request = request.clone({
        setHeaders: {
          Authorization: user.token
        }
      });
    }

    return next.handle(request);
  }
}
