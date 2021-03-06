import { NgModule } from '@angular/core';
import { PostListComponent } from './posts-list/post-list.component';
import { PostCreateComponent } from './posts-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@NgModule({
 declarations : [PostListComponent,PostCreateComponent],
 imports : [ReactiveFormsModule,AngularMaterialModule,CommonModule,RouterModule]
})
export class PostModule {

}
