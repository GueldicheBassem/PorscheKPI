import { Component, OnInit } from '@angular/core';
import { ProjectDataService } from '../../_services/project-data.service';
import Chart from 'chart.js';


@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent {
  selectedProject: string = "Projet";
  projects: string[] = []; 
  project1Data: any = {};
  project2Data: any = {};
  project3Data: any = {};
  project4Data: any = {};

  public nokProducedChart!: Chart;
public canvas: any;
  public ctx!: CanvasRenderingContext2D;
  


  constructor(private projectDataService: ProjectDataService) {}

  formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);
    return `${month}-${day}-${year} | ${hours}:${minutes}:${seconds}`;
  }

  ngOnInit(): void {
    
    
    // Initialize the table with the first project when the component initializes

    this.projectDataService.getLatestProjectDataContinuously().subscribe(data => {


      const projectNames = data.map(project => project.project);
      this.projects=projectNames;
    
      const nokCables = data.map(project => project.nokNumber);
      const producedNumber=data.map(project=>project.producedNumber);
      const RFT=data.map(project=>project.rft);
    

      this.canvas = document.getElementById("StackedBars");
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");

    const gradientStroke1 = this.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, 'rgba(168, 0, 0, 0.2)'); // Deep red color with opacity
gradientStroke1.addColorStop(0.4, 'rgba(168, 0, 0, 0.0)'); // Transparent deep red color
gradientStroke1.addColorStop(0, 'rgba(168, 0, 0, 0)'); // Transparent deep red color

var gradientStroke2 = this.ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke2.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke2.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke2.addColorStop(0, 'rgba(66,134,121,0)'); //green colors


    // Update chart configuration with dynamic data
    new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: projectNames,
        datasets: [
          {
            label: 'Câblages NOK',
            fill: true,
            backgroundColor: gradientStroke1,
            hoverBackgroundColor: gradientStroke1,
            borderColor: '#a80000',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            data: nokCables
          },
          {
            label: 'Nombre Produit',
            fill: true,
            backgroundColor: gradientStroke2,
            borderColor: '#00d6b4',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00d6b4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#00d6b4',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: producedNumber
          }
        ]
      },
      options:gradientBarChartConfiguration
    });
  }


 

    });

    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {

        yAxes: [{
          stacked: true,

          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.2)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 5,
            suggestedMax: 195,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          stacked: true,

          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.2)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 5,
            suggestedMax: 195,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    this.project1Data.efficiency=0
    this.project2Data.efficiency=0
    this.project3Data.efficiency=0
    this.project4Data.efficiency=0
    
    

  }
  

  setSelectedProject(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedIndex = target.selectedIndex;
    const project = this.projects[selectedIndex];
    console.log('setSelectedProject called with project:', project);
    this.selectedProject = project;
    // Fetch data only when a project is selected
    this.fetchProjectData(project);
}


  fetchProjectData(project: string): void {
    // Call your service to fetch latest project data continuously
    this.projectDataService.getLatestProjectDataContinuously().subscribe(
      (data: any[]) => {
        // Find data for the selected project
        const selectedProjectData = data.find(item => item.project === project);
        if (selectedProjectData) {
          // Assign relevant data to the project-specific variable for display
          switch (project) {
            case 'GT4RS':
              this.project1Data = selectedProjectData;
             
              break;
            case 'B4T':
              this.project2Data = selectedProjectData;
             break;
            case 'B6S':
              this.project4Data = selectedProjectData;
             break;
             case '9A3':
              this.project4Data = selectedProjectData;
             break;
             case '992':
              this.project3Data = selectedProjectData;
             break;
            default:
              break;
          }
        } else {
          // Clear project data if no data is found for the selected project
          switch (project) {
            case 'GT4RS':
              this.project1Data = {};
              break;
            case '911':
              this.project2Data = {};
              break;
            case 'CAYAN':
              this.project3Data = {};
              break;
            case '992':
              this.project4Data = {};
              break;
            default:
              break;
          }
        }

      
      },
      (error) => {
        console.error('Error fetching project data:', error);
      }
    );
    
  }

  

  
  
 
}
