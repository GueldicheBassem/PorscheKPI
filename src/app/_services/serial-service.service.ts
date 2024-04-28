import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './project-service.service';
export interface Serial {
  serialId?: number;
  serialName: string;
  reference: string;
  coefficient: number;
  project?: Project| null;// Update this according to your project structure
}

@Injectable({
  providedIn: 'root'
})
export class SerialService {

  private baseUrl = 'http://localhost:9090/api/serial';

  constructor(private http: HttpClient) { }

  createSerial(serial: Serial): Observable<Serial> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    return this.http.post<Serial>(this.baseUrl, serial, { headers });
}

  getSerialById(serialId: number): Observable<Serial> {
    return this.http.get<Serial>(`${this.baseUrl}/${serialId}`);
  }

  updateSerial(serialId: number, serial: Serial): Observable<Serial> {
    return this.http.put<Serial>(`${this.baseUrl}/${serialId}`, serial);
  }

  deleteSerial(serialId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${serialId}`);
  }
  getAllSerials(): Observable<Serial[]> {
    return this.http.get<Serial[]>(this.baseUrl);
  }
}