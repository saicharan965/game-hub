import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, CreateScoreResponse, GetHighScoreResponse, PaginatedLeaderboardResponse } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SnakeFacadeService {
  #apiService = inject(Client)

  public createScore(score: number): Observable<CreateScoreResponse> {
    return this.#apiService.createScore(score)
  }

  public deleteScore(publicIdentifier: string): Observable<void> {
    return this.#apiService.deleteScore(publicIdentifier)
  }

  public getLeaderboards(publicIdentifier: string): Observable<GetHighScoreResponse> {
    return this.#apiService.getScoreById(publicIdentifier)
  }

  public getLeaderboard(page: number | undefined, pageSize: number | undefined): Observable<PaginatedLeaderboardResponse> {
    return this.#apiService.getLeaderboard(page, pageSize)
  }
}
