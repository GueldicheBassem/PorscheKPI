import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import Chart, { ChartConfiguration, ChartDataSets } from 'chart.js';
import { ProjectDataService } from "../../_services/project-data.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public canvas1 : any;
  public ctx!: CanvasRenderingContext2D;
  public datasets: any;

  public data: any;
  public myChartData!: Chart;
  myKosuChart!: Chart;

  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;


  public efficiencyChartData: any[] = [];
  public shiftDates: string[] = [];
  myChart!: Chart;


  gradientStrokeB1!: CanvasGradient;
  gradientStrokeB2!: CanvasGradient;

  
  workforcePresentTotal: number = 0;
  totalProducedNumber: number = 0;
  totalNokNumber: number = 0;
  lastCablingTime: string = '';
  sectorEfficiency: number=0;
  ppm: number = 0;
  totalRFT: number=0;
  sectorRFT: number=0;


  constructor(private projectDataService: ProjectDataService,private http:HttpClient) {
    

  }
  private formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  

  calculatePPM(totalNokNumber: number, totalProducedNumber: number): number {
    if (totalProducedNumber === 0) {
      return 0; // Avoid division by zero
    }
    const ppm = (totalNokNumber / totalProducedNumber) * Math.pow(10, 6);
  return parseFloat(ppm.toFixed(4));
  }


  

  ngOnInit() {

    this.canvas1 = document.getElementById("chartLineRed");
    this.ctx = this.canvas1.getContext("2d");
    this.fetchChartData();

    
    const today = new Date().toLocaleDateString();

    this.projectDataService.getLatestProjectDataContinuously().subscribe(data => {
     

      const todayProjects = data.filter(project => new Date(project.date).toLocaleDateString() === today);
      
      this.workforcePresentTotal = todayProjects.reduce((acc, project) => acc + project.workforcePresent, 0);
      this.totalProducedNumber = todayProjects.reduce((acc, project) => acc + project.producedNumber, 0);
      this.totalNokNumber = todayProjects.reduce((acc, project) => acc + project.nokNumber, 0);
      this.totalRFT = todayProjects.reduce((acc, project) => acc + project.rft, 0);

      // Calculate the sector efficiency
      this.sectorEfficiency = Math.floor(todayProjects.reduce((acc, project) => acc + project.efficiency, 0) / todayProjects.length);
      this.sectorRFT=Math.floor(this.totalRFT / todayProjects.length);


      const lastCabling = data.reduce((prev, current) => (new Date(prev.date) > new Date(current.date) ? prev : current));
      const lastCablingDate = new Date(lastCabling.date);
      const formattedDate = this.formatDate(lastCablingDate);
      const formattedTime = lastCablingDate.toLocaleTimeString();
      this.lastCablingTime = `Project ${lastCabling.project} : ${formattedDate} | ${formattedTime}`;
      const projectNames = todayProjects.map(project => project.project);
      const nokCables = todayProjects.map(project => project.nokNumber);
      const producedNumber=todayProjects.map(project=>project.producedNumber)
      this.ppm = this.calculatePPM(this.totalNokNumber, this.totalProducedNumber);
  

      this.canvas = document.getElementById("NOK CHART");
    this.ctx  = this.canvas.getContext("2d");

    const gradientStroke1 = this.ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke1.addColorStop(1, 'rgba(168, 0, 0, 0.2)'); // Deep red color with opacity
gradientStroke1.addColorStop(0.4, 'rgba(168, 0, 0, 0.0)'); // Transparent deep red color
gradientStroke1.addColorStop(0, 'rgba(168, 0, 0, 0)'); // Transparent deep red color


    // Update chart configuration with dynamic data
    const myChart1 = new Chart(this.ctx, {
      type: 'horizontalBar',
      data: {
        labels: projectNames,
        datasets: [{
          label: "NOK Cablages  ",
          fill: true,
          backgroundColor: gradientStroke1,
          hoverBackgroundColor: gradientStroke1,
          borderColor: '#a80000',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: nokCables,
        }]
      },
      options: gradientBarChartConfiguration
    });

    this.canvas = document.getElementById("chartLineGreen");
    this.ctx = this.canvas.getContext("2d");


    var gradientStroke2 = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke2.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke2.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data2 = {
      labels:projectNames,
      datasets: [{
        label: "Nombre Produit",
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
        data:producedNumber,
      }]
    };

    var myChart = new Chart(this.ctx, {
      type: 'bar',
      data: data2,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });
  });

  

  


    var gradientChartOptionsConfigurationWithTooltipBlue: any = {
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
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 10,
            suggestedMax: 50,
            padding: 20,
            fontColor: "#2380f7"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#2380f7"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipPurple: any = {
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
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(225,78,202,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
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
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipOrange: any = {
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
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 50,
            suggestedMax: 110,
            padding: 20,
            fontColor: "#ff8a76"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(220,53,69,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#ff8a76"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
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

          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 10,
            suggestedMax: 50,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: ' rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


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

          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.2)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 5,
            suggestedMax: 50,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(168, 0, 0, 0.2)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 5,
            suggestedMax: 30,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };



    


  
    
this.fetchEfficiencyData();


  }



  fetchEfficiencyData() {
    this.http.get<any[]>('http://localhost:9090/api/dashboard/last7days').subscribe(data => {
      const efficiencyByDate: { [date: string]: { night: number[], morning: number[], ppmNight: number[], ppmMorning: number[] } } = {};

      data.forEach(stat => {
        const date = stat.shiftDate;
        if (!efficiencyByDate[date]) {
          efficiencyByDate[date] = { night: [], morning: [], ppmNight: [], ppmMorning: [] };
        }

        if (stat.shiftType === 'Équipe du Nuit') {
          efficiencyByDate[date].night.push(stat.averageEfficiency);
          efficiencyByDate[date].ppmNight.push(stat.ppm);
        } else if (stat.shiftType === 'Équipe du Matin') {
          efficiencyByDate[date].morning.push(stat.averageEfficiency);
          efficiencyByDate[date].ppmMorning.push(stat.ppm);
        }
      });

      this.shiftDates = Object.keys(efficiencyByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const nightShiftEfficiency: number[] = [];
      const morningShiftEfficiency: number[] = [];
      const nightShiftPPM: number[] = [];
      const morningShiftPPM: number[] = [];

      this.shiftDates.forEach(date => {
        nightShiftEfficiency.push(this.calculateAverage(efficiencyByDate[date].night));
        morningShiftEfficiency.push(this.calculateAverage(efficiencyByDate[date].morning));
        nightShiftPPM.push(this.calculateAverage(efficiencyByDate[date].ppmNight));
        morningShiftPPM.push(this.calculateAverage(efficiencyByDate[date].ppmMorning));
      });

      this.efficiencyChartData = [
        { label: 'Night Shift Efficiency', data: nightShiftEfficiency },
        { label: 'Morning Shift Efficiency', data: morningShiftEfficiency },
        { label: 'Night Shift PPM', data: nightShiftPPM },
        { label: 'Morning Shift PPM', data: morningShiftPPM }
      ];

    });

    
  }

  calculateAverage(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  updateChart(chart_labels: string[], datasets: any[]) {
    
    const canvas = document.getElementById("chartBig1") as HTMLCanvasElement;
  if (!canvas) return; // Check if canvas is found

  const ctx = canvas.getContext("2d");
  if (!ctx) return; // Check if context is available

    const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)');


    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: true,
        
        position: 'top', // Show legend at the bottom
        labels: {
          usePointStlye:false,
          fontColor: '#9a9a9a',// Adjust legend label color

          
          padding: 20,
          boxWidth: 10, // Adjust the width of the legend color boxes
          generateLabels: (Chart.defaults.global?.legend?.labels?.generateLabels as any) ?? (() => []),
          
        }
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
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 100,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)', 
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],
        }
    };
    const config = {
      type: 'line',
      data: {
          labels: chart_labels,
          datasets: datasets.map((data, index) => ({
              label: data.label,
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: index === 0 ? '#ec250d' : '#1e88e5', // Change border color for morning shift
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: index === 0 ? '#ec250d' : '#1e88e5', // Set dot color same as line color
              pointBorderColor: 'rgba(255,255,255,0)',
              pointHoverBackgroundColor: index === 0 ? '#ec250d' : '#1e88e5', // Set dot hover color same as line color
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: data.data,
          }))
      },
      options: gradientChartOptionsConfigurationWithTooltipRed,
  };

  if (this.myChartData) {
    // Update chart with new data
    this.myChartData.data.labels = config.data.labels;
    this.myChartData.data.datasets = config.data.datasets;
    this.myChartData.update({ duration: 800, lazy: false, easing: 'easeOutBack' }); // Smooth animation
} else {
    // Create new chart if myChartData doesn't exist
    this.myChartData = new Chart(ctx, config);
}
  }



  
  updateOptions(type: string) {
    if (type === 'efficiency') {
        this.updateChart(this.shiftDates, [
            { label: 'Night Shift Efficiency', data: this.efficiencyChartData[0].data },
            { label: 'Morning Shift Efficiency', data: this.efficiencyChartData[1].data }
        ]);
    } else if (type === 'ppm') {
        this.updateChart(this.shiftDates, [
            { label: 'Night Shift PPM', data: this.efficiencyChartData[2].data },
            { label: 'Morning Shift PPM', data: this.efficiencyChartData[3].data }
        ]);
    }
}






fetchChartData() {
  this.http.get<any>('http://localhost:9090/api/dashboard/last7dayskosu').subscribe(data => {
    this.updateChart2(data);

    // Plot the chart
  
  });
}



updateChart2(data: any) {
  // Define gradient strokes
  const gradientStrokeB1 = this.ctx.createLinearGradient(0, 230, 120, 50);
  gradientStrokeB1.addColorStop(1, 'rgba(29,140,248,0.5)');
  gradientStrokeB1.addColorStop(0.4, 'rgba(29,140,248,0.2)');
  gradientStrokeB1.addColorStop(0, 'rgba(29,140,248,0.1)');

  const gradientStrokeB2 = this.ctx.createLinearGradient(0, 250, 100, 20);
  gradientStrokeB2.addColorStop(1, 'rgba(66,134,121,0.8)');
  gradientStrokeB2.addColorStop(0.4, 'rgba(66,134,121,0.4)');
  gradientStrokeB2.addColorStop(0, 'rgba(66,134,121,0.1)');


  const gradient = this.ctx.createLinearGradient(20, 0, 220, 0);

// Add three color stops
gradient.addColorStop(0, "green");
gradient.addColorStop(0.5, "cyan");
gradient.addColorStop(1, "green");


  const labels: string[] = Object.keys(data);
  const selectedShift: string = this.selectedShift || "Équipe du Matin";

  // Generate color palettes for morning and night shifts
  const morningLines = Object.keys(data[labels[0]]['Équipe du Matin']);
  const nightLines = Object.keys(data[labels[0]]['Équipe du Nuit']);
 

  const grd = this.ctx.createLinearGradient(0, 230, 120, 50);
grd.addColorStop(1, 'rgba(233,32,16,0.5)');
grd.addColorStop(0.4, 'rgba(233,32,16,0.2)');
grd.addColorStop(0, 'rgba(233,32,16,0.1)'); //red colors
  const datasets: { label: string; data: number[]; backgroundColor: CanvasGradient }[] = [];

  labels.forEach((date: string) => {
    const shiftData = data[date][selectedShift] || {};
    const lineNames = Object.keys(shiftData);
    const bluishPalette = [gradientStrokeB1,gradientStrokeB2,grd];
    labels.forEach((date: string) => {
      const shiftData = data[date][selectedShift] || {};
      const lineNames = Object.keys(shiftData);
  
      lineNames.forEach((lineName: string) => {
        const value = shiftData[lineName];
        if (value !== undefined && value !== null) {
          // Check if the line has already been added to the dataset
          const lineExists = datasets.some(dataset => dataset.label === lineName);
  
          if (!lineExists) {
            // Assign a color from the bluish palette
            let color: CanvasGradient;
            const matchingDataset = datasets.find(dataset => dataset.label === lineName);
            if (matchingDataset) {
              color = matchingDataset.backgroundColor; // Reuse color if it already exists
            } else {
              color = bluishPalette[datasets.length % bluishPalette.length]; // Use next color from palette
            }
  
            // Add the line to the dataset
            const lineData: number[] = [];
            labels.forEach((label: string) => {
              const shiftData = data[label][selectedShift] || {};
              lineData.push(shiftData[lineName] || 0);
            });
  
            datasets.push({
              label: lineName,
              data: lineData,
              backgroundColor: color,
            });
          }
        }
      });
    })});
  
    if (this.myChart) {
      this.myChart.destroy();
    }

  const gradientChartOptionsConfigurationWithTooltipBlue: any = {
    maintainAspectRatio: false,
    legend: {
      display: true
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
        barPercentage: 0.8,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
          padding: 15,
          fontColor: "#2380f7"
        }
      }],
      xAxes: [{
        barPercentage: 0.8,
        categorySpacing: 0.1,
        gridLines: {
          drawBorder: false,
          color: 'rgba(29,140,248,0.1)',
          zeroLineColor: "transparent",
        },
        ticks: {
          padding: 20,
          fontColor: "#2380f7"
        }
      }]
    }
  };


  
  

  var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

 

  this.myChart = new Chart(this.ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets.map(dataset => ({
        ...dataset,
      
        hoverBackgroundColor: gradientStroke,
        borderColor: dataset.backgroundColor,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,

      
      })),
    },
    options: gradientChartOptionsConfigurationWithTooltipBlue,
 
  });
}  




selectedShift: string = "Équipe du Matin"; // Default shift

toggleShift(shift: string) {
  this.selectedShift = shift;
  this.canvas1 = document.getElementById("chartLineRed");
    this.ctx = this.canvas1.getContext("2d");
  this.fetchChartData();
}

}