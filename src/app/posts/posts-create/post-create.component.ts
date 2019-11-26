import { Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  templateUrl: '../posts-create/post-create.component.html',
  selector: 'app-post-create',
  styleUrls : ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit,OnDestroy {
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
  constructor(public postService: PostService, public activatedRoute: ActivatedRoute,public authService: AuthService) {}
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false; 
    })
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.form = new FormGroup({
        title: new FormControl(null, {validators : [Validators.required]}),
        content: new FormControl(null, {validators : [Validators.required, Validators.minLength(3)]}),
        image : new FormControl(null, {validators : [Validators.required], asyncValidators : [mimeType]})
      }
      );
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        console.log(paramMap);
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
        this.isLoading = false;
        this.post = {
          id : postData._id,
          title : postData.title,
          content: postData.content,
          imagePath: postData.imagePath,
          creator: postData.creator };
        this.form.setValue({title : this.post.title, content: this.post.content, image: this.post.imagePath});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }
  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: this.form.value.title,
      content: this.form.value.content,
      imagePath: this.form.value.image,
      creator: null
    };
    if (this.mode === 'create') {
    this.postService.addPosts(post, this.form.value.image);
    } else if (this.mode === 'edit') {
      post.id = this.postId;
      this.postService.updatePost(post, this.form.value.image);
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    }
}
