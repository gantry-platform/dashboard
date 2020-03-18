import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackendsModule } from './modules/backends-modules';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { MaterialModule } from './modules/material-module';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { CatalogsPageComponent } from './components/catalogs-page/catalogs-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ProjectPodsPageComponent } from './components/project-pods-page/project-pods-page.component';
import { ProjectServicesPageComponent } from './components/project-services-page/project-services-page.component';
import { ProjectMembersPageComponent } from './components/project-members-page/project-members-page.component';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    NotFoundComponent,
    DashboardPageComponent,
    CatalogsPageComponent,
    EventsPageComponent,
    ProjectPageComponent,
    SidenavComponent,
    BreadcrumbsComponent,
    ProjectPodsPageComponent,
    ProjectServicesPageComponent,
    ProjectMembersPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BackendsModule,
    AppRoutingModule,
    KeycloakAngularModule,
    MaterialModule,
    NgMaterialMultilevelMenuModule
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService
    }
  ],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef) {
    keycloakService
      .init(environment.keycloakOptions)
      .then(() => {
        appRef.bootstrap(AppComponent);
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}

