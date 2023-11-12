import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListQueuesComponent } from './list-queues/list-queues.component';
import { ListTopicsComponent } from './list-topics/list-topics.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'queues', component: ListQueuesComponent},
  { path: 'topics', component: ListTopicsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
