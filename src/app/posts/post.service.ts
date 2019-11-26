import {Post} from './post.model';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + '/posts/';
@Injectable({providedIn: 'root'})
export class PostService {
  constructor(private httpClient: HttpClient, private router: Router) {}
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
    getPosts(postsPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
      this.httpClient.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
      return  {posts : postData.posts.map(post => {
        return {
          title: post.title,
          content : post.content,
          id : post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts : postData.maxPosts};
    })
    )
    .subscribe((mappedPostsData) => {
      this.posts = mappedPostsData.posts;
      this.postsUpdated.next({posts: [...this.posts], postCount: mappedPostsData.maxPosts});
    });
  }
    addPosts(post: Post, image: File) {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', image, post.title);
    this.httpClient.post<{message: string, post: Post}>(BACKEND_URL, postData).subscribe(
      (responseData) => {
        this.router.navigate(['/']);
     });
  }
    getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
    getPost(postId: string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>
    (BACKEND_URL + postId);
  }

    updatePost(updatedPost: Post, image: string | File) {
      let postData: Post | FormData;
      if (typeof(image) === 'object') {
        postData = new FormData();
        postData.append('id', updatedPost.id);
        postData.append('title', updatedPost.title);
        postData.append('content', updatedPost.content);
        postData.append('image', image, updatedPost.title);
      } else {
          postData = {
          id : updatedPost.id,
          title : updatedPost.title,
          content : updatedPost.content,
          imagePath : updatedPost.imagePath,
          creator : null
        };
      }
      this.httpClient.put<{message: string}>(BACKEND_URL + updatedPost.id, postData).subscribe(responseData => {
        this.router.navigate(['/']);
        });
    }
    deletePost(postId: string) {
   return this.httpClient.delete(BACKEND_URL + postId);
  }
}
