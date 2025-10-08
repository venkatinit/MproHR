import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { ToastrService } from "ngx-toastr";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService, private router: Router
        , private toastrService: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // return next.handle(req);
        if (req.headers.get('No-Auth') == "True") {
            return next.handle(req);
        }
        else {
            const accessToken = this.authService.getAccessToken();
            //console.log(accessToken);
            if (accessToken != null) {
                const authReq = req.clone({
                    //setHeaders: { Authorization: `Bearer ${accessToken}` },
                    setHeaders: {},
                });
                // // console.log(authReq);
                return next.handle(authReq).pipe(
                    map((event: HttpEvent<any>) => {
                        return event;
                    }),
                    catchError((error: HttpErrorResponse) => {
                        let data:any = {};
                        data = {
                            reason: error && error.error && error.error.reason ? error.error.reason : '',
                            status: error.status
                        };
                        console.log(error.status);
                        if (error.status == 401 || error.status == 0) {
                            this.toastrService.warning("Please Login", "Session Expired");
                            this.router.navigate(['/login']);
                        } else if (error.status == 500) {
                            this.toastrService.success(data, "Error");
                            this.router.navigate(['/login']);
                        }

                        return throwError(error);
                    })
                );
            } else {
                 this.toastrService.success("Session Expired", "Error");
                 this.router.navigate(['/auth/login']);
                return next.handle(req);
            }

        }

    }
}