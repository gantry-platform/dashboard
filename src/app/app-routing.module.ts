import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ProjectsPageComponent } from './components/projects-page/projects-page.component';
import { CatalogsPageComponent } from './components/catalogs-page/catalogs-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';

import { ProjectPageComponent } from './components/project-page/project-page.component';
import { PodsComponent } from './components/pods/pods.component';
import { ServicesComponent } from './components/services/services.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'catalogs', component: CatalogsPageComponent },
  { path: 'events', component: EventsPageComponent },
  {
    path: 'project/:id', component: ProjectPageComponent,
    children: [
      { path: '', redirectTo: 'pods', pathMatch: 'full' },
      { path: 'pods', component: PodsComponent, data: {'breadcrumb' : 'pods'} },
      { path: 'services', component: ServicesComponent, data: {'breadcrumb' : 'services'} },
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
