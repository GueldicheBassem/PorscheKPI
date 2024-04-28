import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  selectedDate!: Date;
  selectedShift!: string;
  selectedOption!: string;
  hourlyKosuEntries!: any[] | null;
  endOfShiftStatsEntries!: any[];
  endOfShiftKosu: any;
  averageEfficiency: number | undefined;
  ppmFinal: number | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  fetchShiftDetails(): void {
    if (this.selectedOption === 'Kosu') {
      this.http.get<any>('http://localhost:9090/hourly-kosu/' + this.selectedDate + '/' + this.selectedShift).subscribe(data => {
        this.hourlyKosuEntries = data;
      });
      this.http.get<any>('http://localhost:9090/end-of-kosu/' + this.selectedDate + '/' + this.selectedShift).subscribe(data => {
        this.endOfShiftKosu = data;
      });
    } else if (this.selectedOption === 'Production Statistics') {
      this.http.get<any>('http://localhost:9090/end-of-shift-stats/' + this.selectedDate + '/' + this.selectedShift).subscribe(data => {
        this.endOfShiftStatsEntries = data;
        const sumProduced = this.endOfShiftStatsEntries.reduce((acc: number, val: any) => acc + val.producedNumber, 0);
        
        const sumNok = this.endOfShiftStatsEntries.reduce((acc: number, val: any) => acc + val.nokNumber, 0);
      
         
        this.ppmFinal = (sumNok / sumProduced) * 1000000;

        // Calculate Average Efficiency
        const sumEfficiency = this.endOfShiftStatsEntries.reduce((acc: number, val: any) => acc + val.efficiency, 0);
        this.averageEfficiency = sumEfficiency / this.endOfShiftStatsEntries.length;
      });
    }
  }
}

