import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PostListComponent } from './posts/posts-list/post-list.component';
import { PostCreateComponent } from './posts/posts-create/post-create.component';

import { AuthGard } from './auth/auth.guard';
const routes: Routes = [
  {path: '', component : PostListComponent},
  {path: 'create', component : PostCreateComponent, canActivate: [AuthGard]},
  {path: 'edit/:postId', component : PostCreateComponent, canActivate: [AuthGard]},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];
@NgModule({
  imports : [RouterModule.forRoot(routes)],
  exports : [RouterModule],
  providers: [AuthGard]
})

export class AppRoutingModule {

}
