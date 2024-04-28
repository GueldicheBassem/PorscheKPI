import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  private baseUrl = '/GetFile1Data'; // Update the URL if necessary

  constructor(private http: HttpClient) { }

  getProjectData(): Observable<{ workforcePresent: number, producedNumber: number, nokNumber: number, date: string }> {
    return this.http.get<{ workforcePresent: number, producedNumber: number, nokNumber: number, date: string }>(this.baseUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching project data:', error);
          return throwError(error);
        })
      );
  }

  fetchDataAndAssignVariables(): Observable<{ workforcePresent: number, producedNumber: number, nokNumber: number, date: string }> {
    return this.getProjectData();
  }
}