import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  constructor(private http: HttpClient) {}



  getAllProjectNames(): Observable<string[]> {

    return this.http.get<string[]>("http:/localhost:9090/GetAllProjectNames");
  }

  getLatestProjectDataContinuously(): Observable<any[]> {
    // Fetch the latest project data every 30 seconds
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.http.get<any[]>('http://localhost:9090/GetFileData')),
      map(data => {
        // Process and distribute the data to respective project classes
        const project1 = this.mapDataToProject1(data[0]);
        const project2 = this.mapDataToProject2(data[1]);
        const project3 = this.mapDataToProject3(data[2]);
        const project4 = this.mapDataToProject4(data[3]);
        
        return [project1, project2, project3, project4];
      })
    );
  }

  // Mapping method for Project 1
  private mapDataToProject1(data: any): any {
    return {
      id: data.id,
      project: data.project,
      workforcePresent: data.workforcePresent,
      efficiency: data.efficiency,
      producedNumber: data.producedNumber,
      nokNumber: data.nokNumber,
      rft: data.rft,
      ppm:data.ppm,
      date: data.date
    };
  }

  // Mapping method for Project 2
  private mapDataToProject2(data: any): any {
    return {
      id: data.id,
      project: data.project,
      workforcePresent: data.workforcePresent,
      efficiency: data.efficiency,
      producedNumber: data.producedNumber,
      nokNumber: data.nokNumber,
      rft: data.rft,
      date: data.date,
      ppm:data.ppm,
    };
  }

  // Mapping method for Project 3
  private mapDataToProject3(data: any): any {
    return {
      id: data.id,
      project: data.project,
      workforcePresent: data.workforcePresent,
      efficiency: data.efficiency,
      producedNumber: data.producedNumber,
      nokNumber: data.nokNumber,
      rft: data.rft,
      ppm:data.ppm,
      date: data.date
    };
  }

  // Mapping method for Project 4
  private mapDataToProject4(data: any): any {
    return {
      id: data.id,
      project: data.project,
      workforcePresent: data.workforcePresent,
      efficiency: data.efficiency,
      producedNumber: data.producedNumber,
      nokNumber: data.nokNumber,
      rft: data.rft,
      ppm:data.ppm,
      date: data.date
    };
  }
}
