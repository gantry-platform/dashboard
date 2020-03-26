import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { LoaderService } from 'src/app/services/loader.service';
import { Observable } from 'rxjs';
import { finalize } from "rxjs/operators";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

    constructor(
        private loaderService: LoaderService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("LoaderInterceptor...");

        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        );
    }

}