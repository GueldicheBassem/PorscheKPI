// group.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Groupe {
  groupId?: number;
  groupName: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = 'http://localhost:9090/api/groups';

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<Groupe[]> {
    return this.http.get<Groupe[]>(this.baseUrl);
  }

  createGroup(group: Groupe): Observable<Groupe> {
    return this.http.post<Groupe>(this.baseUrl, group);
  }

  updateGroup(groupId: number, group: Groupe): Observable<Groupe> {
    return this.http.put<Groupe>(`${this.baseUrl}/${groupId}`, group);
  }

  deleteGroup(groupId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}`);
  }
}
