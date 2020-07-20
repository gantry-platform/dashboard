import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiModule as UserSwaggerApiModule } from '../restapi/user-swagger/api.module';
import { ApiModule as ProjectSwaggerApiModule } from '../restapi/project-swagger/api.module';

@NgModule({
    imports: [
        UserSwaggerApiModule.forRoot({ rootUrl: environment.userManagementRestApi }),
        ProjectSwaggerApiModule.forRoot({ rootUrl: environment.projectManagementRestApi })
    ]
})
export class BackendsModule { }
