import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {Post} from '../post.model';
import { PostService } from '../post.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector : 'app-post-list',
  templateUrl : '../posts-list/post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postService: PostService, private authService: AuthService) {}
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated = false;
  private postSub: Subscription = new Subscription();
  private authSub: Subscription = new Subscription();
  userId: string;
  ngOnInit(): void {
  this.postService.getPosts(this.postsPerPage, this.currentPage);
  this.isLoading = true;
  this.userId = this.authService.getUserId();
  this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number}) => {
    this.isLoading = false;
    this.posts = postData.posts;
    this.totalPosts = postData.postCount;
  });
  this.userIsAuthenticated = this.authService.getIsAuthenticated();
  this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();
  });
  }
  ngOnDestroy(): void {
      this.postSub.unsubscribe();
      this.authSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe( () => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    },() => {
      this.isLoading = false;
    });
 }

  onChangedPage(page: PageEvent) {
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.postsPerPage = page.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
