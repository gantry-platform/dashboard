import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material-module';
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CatalogsPageComponent } from './components/catalogs-page/catalogs-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { PodsComponent } from './components/pods/pods.component';
import { ServicesComponent } from './components/services/services.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HomePageComponent,
    ProjectsPageComponent,
    ToolbarComponent,
    NotFoundComponent,
    CatalogsPageComponent,
    EventsPageComponent,
    PodsComponent,
    ServicesComponent,
    BreadcrumbsComponent,
    ProjectPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    KeycloakAngularModule,
    BrowserAnimationsModule,
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

