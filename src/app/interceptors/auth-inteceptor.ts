import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip interceptor for requests that explicitly set No-Auth header
        if (req.headers.get('No-Auth') === 'True') {
            return next.handle(req);
        }

        const accessToken = this.authService.getAccessToken();

        // Clone request with token if available
        const authReq = accessToken
            ? req.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
            })
            : req;

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                // Handle API error responses
                switch (error.status) {
                    case 0:
                    case 401:
                        this.toastrService.warning('Please log in again.', 'Session Expired');
                        this.authService.clearSession(); // optional: clear tokens from localStorage
                        this.router.navigate(['/auth/login']); // 👈 make sure this matches your routing
                        break;

                    case 403:
                        this.toastrService.error('You are not authorized to access this resource.', 'Access Denied');
                        break;

                    case 500:
                        this.toastrService.error('Internal server error. Please try again later.', 'Server Error');
                        break;

                    default:
                        this.toastrService.error('Something went wrong.', 'Error');
                        break;
                }

                return throwError(() => error);
            })
        );
    }
}
