import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiModule as UserSwaggerApiModule } from '../restapi/user-swagger/api.module';

@NgModule({
    imports: [
        UserSwaggerApiModule.forRoot({ rootUrl: environment.userManagementRestApi })
    ]
})
export class BackendsModule { }
