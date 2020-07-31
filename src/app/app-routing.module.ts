import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { CatalogsPageComponent } from './components/catalogs-page/catalogs-page.component';
import { EventsPageComponent } from './components/events-page/events-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { ProjectPodsPageComponent } from './components/project-pods-page/project-pods-page.component';
import { ProjectServicesPageComponent } from './components/project-services-page/project-services-page.component';
import { ProjectMembersPageComponent } from './components/project-members-page/project-members-page.component';
import { ProjectPipelinePageComponent } from './components/project-pipeline-page/project-pipeline-page.component';

const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'catalogs', component: CatalogsPageComponent },
  { path: 'events', component: EventsPageComponent },
  {
    path: 'project/:id', component: ProjectPageComponent,
    children: [
      { path: '', redirectTo: 'pods', pathMatch: 'full' },
      { path: 'pods', component: ProjectPodsPageComponent, data: { 'breadcrumb': 'Pods' } },
      { path: 'services', component: ProjectServicesPageComponent, data: { 'breadcrumb': 'Services' } },
      { path: 'pipeline', component: ProjectPipelinePageComponent, data: { 'breadcrumb': 'Pipeline' } },
      { path: 'members', component: ProjectMembersPageComponent, data: { 'breadcrumb': 'Members' } }
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
