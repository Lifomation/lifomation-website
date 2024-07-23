import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = environment.apiEndpoint;
  userId: string | undefined;

  constructor(private http: HttpClient, private auth: AuthService) {
    // Existing constructor code
  }
  get isAuthenticated$() {
    // return this.auth.isAuthenticated$;
    return this.auth.user$.subscribe((user) => {
      console.log('user', user);
      if (user) {
        // Extract the user_id from the user profile
        this.userId = user.sub;
        console.log('User ID:', this.userId);
      }
    });
  }
  // @d-p35: This function returns the user id
  getUserId(): Observable<string> {
    return this.auth.user$.pipe(map((user) => user?.sub ?? 'Unknown UID'));
  }
  /**
   * HttpClient has methods for all the CRUD actions: get, post, put, patch, delete, and head.
   * First parameter is the URL, and the second parameter is the body.
   * You can use this as a reference for how to use HttpClient.
   * @param content The content of the message
   * @returns
   */
  //   addMessage(content: string): Observable<Message> {
  //     return this.http.post<Message>(this.endpoint + '/api/messages', {
  //       content,
  //     });
  //   }

  createUser(userId: string): Observable<any> {
    return this.http.post(this.endpoint + '/api/users', { userId });
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(this.endpoint + '/api/documents', formData);
  }

  getDocuments(
    page?: number,
    rows?: number,
    userId?: string,
    folderName?: string
  ): Observable<any> {
    page = page ?? 0;
    rows = rows ?? 10;
    folderName = folderName ?? '';
    console.log(
      'The page is:',
      page,
      'The rows is:',
      rows,
      'The user ID is:',
      userId,
      'The folder name is:',
      folderName
    );
    return this.http.get(
      `${this.endpoint}/api/documents?page=${page}&rows=${rows}&userId=${userId}&categoryName=${folderName}`
    );
  }
  getRecentDocuments(userId: String): Observable<any> {
    return this.http.get(
      this.endpoint + `/api/documents/recent?userId=${userId}`
    );
  }

  getDocument(documentId: number, userId: String): Observable<any> {
    return this.http.get(this.endpoint + `/api/documents/${documentId}?userId=${userId}`);
  }

  deleteDocument(documentId: number, userId: String): Observable<any> {
    return this.http.delete(this.endpoint + `/api/documents/${documentId}?userId=${userId}`);
  }

  getFile(documentId: number, userId: String): Observable<Blob> {
    return this.http.get(this.endpoint + `/api/documents/${documentId}/file?userId=${userId}`, {
      responseType: 'blob',
    });
  }

  updateLastOpened(documentId: number, userId: String): Observable<any> {
    return this.http.patch(
      this.endpoint + `/api/documents/lastOpened/${documentId}?userId=${userId}`,
      { time: new Date().toISOString() }
    );
  }

  searchDocuments(query: string, userId: string): Observable<any> {
    return this.http.get(
      `${this.endpoint}/api/documents/search?q=${query}&userId=${userId}`
    );
  }

  changeCategory(documentId: number, category: string, userId: String): Observable<any> {
    return this.http.patch(
      this.endpoint + `/api/documents/category/${documentId}?userId=${userId}`,
      { category }
    );
  }

  starDocument(documentId: number, starred: boolean): Observable<any> {
    return this.http.patch(
      this.endpoint + `/api/documents/starred/${documentId}/file`,
      { starred }
    );
  }

  getStarredDocuments(userId: String): Observable<any> {
    return this.http.get(
      this.endpoint + `/api/documents/star?userId=${userId}`
    );
  }

  //   deleteMessage(messageId: number): Observable<Message> {
  //     return this.http.delete<Message>(
  //       this.endpoint + `/api/messages/${messageId}`,
  //     );
  //   }

  //   upvoteMessage(messageId: number) {
  //     return this.http.patch<Message>(
  //       this.endpoint + `/api/messages/${messageId}`,
  //       { action: 'upvote' },
  //     );
  //   }

  //   downvoteMessage(messageId: number) {
  //     return this.http.patch<Message>(
  //       this.endpoint + `/api/messages/${messageId}`,
  //       { action: 'downvote' },
  //     );
  //   }

  //   getMessages(): Observable<{ messages: Message[] }> {
  //     return this.http.get<{ messages: Message[] }>(
  //       this.endpoint + `/api/messages`,
  //     );
  //   }

  //   signIn(username: string, password: string): Observable<any> {
  //     return this.http.post(this.endpoint + '/api/users/signin', {
  //       username,
  //       password,
  //     });
  //   }

  //   signUp(username: string, password: string): Observable<any> {
  //     return this.http.post(this.endpoint + '/api/users/signup', {
  //       username,
  //       password,
  //     });
  //   }

  //   signOut(): Observable<any> {
  //     return this.http.get(this.endpoint + '/api/users/signout');
  //   }

  //   me(): Observable<any> {
  //     return this.http.get(this.endpoint + '/api/users/me');
  //   }
}
