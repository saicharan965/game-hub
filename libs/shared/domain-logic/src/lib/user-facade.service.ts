import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, CreateUserRequest, CreateUserResponse, UpdateUserRequest, UserDetailsResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  #apiService = inject(Client)

  public createUser(userDetails: CreateUserRequest): Observable<CreateUserResponse> {
    return this.#apiService.createOrGetUser(userDetails)
  }

  public deleteUser(id: string): Observable<void> {
    return this.#apiService.deleteUser(id)
  }

  public updateUser(userDetails: UpdateUserRequest): Observable<UserDetailsResponse> {
    return this.#apiService.updateUser(userDetails)
  }

  public getUserById(publicIdentifier: string): Observable<UserDetailsResponse> {
    return this.#apiService.getUserById(publicIdentifier)
  }
}
