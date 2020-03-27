import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { finalize } from "rxjs/operators";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private loaderService: LoaderService,
        private dialog: MatDialog
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');

        if (token) {
            request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        this.loaderService.show();

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    // this.errorDialogService.openDialog(event);
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                console.error(error);
                const data = {
                    // reason: error && error.error && error.error.message ? error.error.message : '',
                    message: error.message,
                    status: error.status
                };

                this.dialog.open(ErrorDialogComponent, {
                    data: data
                }).afterClosed().pipe(take(1)).subscribe(() => {
                    // if (error.status === 401 && error.statusText === 'Unauthorized') {
                    //     this.authService.logout();
                    // }
                });
                return throwError(error);
            }),
            finalize(() => {
                this.loaderService.hide();
            }));
    }
}