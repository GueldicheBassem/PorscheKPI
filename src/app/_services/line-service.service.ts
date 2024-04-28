import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project-service.service';

export interface Line {
  lineId?: number;
  lineName: string;
  project?: Project | null;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class LineService {

  private apiUrl = 'http://localhost:9090/api/line';

  constructor(private http: HttpClient) { }

  getAllLines(): Observable<Line[]> {
    return this.http.get<Line[]>(this.apiUrl);
  }

  createLine(line: Line): Observable<Line> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Line>(this.apiUrl, line, httpOptions);
  }

  updateLine(lineId: number, updatedLine: Line): Observable<Line> {
    return this.http.put<Line>(`${this.apiUrl}/${lineId}`, updatedLine);
  }

  deleteLine(lineId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${lineId}`);
  }
}
