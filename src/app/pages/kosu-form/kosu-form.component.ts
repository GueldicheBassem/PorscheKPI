    import { Component, OnInit } from "@angular/core";
    import { FormControl } from "@angular/forms";
    import { IndividualConfig, ToastrService } from 'ngx-toastr';
    import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
    import { HttpClient } from "@angular/common/http";

  
    interface Line {
      name: string;
      id: number;
    }
    export interface Groupe {
      groupId: number;
      groupName: string;
    }
    export interface Serial {
      serialId: number;
      serialName: string;
      
    }

    export interface HourlyKosuResponse {
      editMode: boolean;
      entryId: number;
      group: string;
      line: string;
      hour: number;
      serial: string;
      netWorkTime: number;
      producedCables: number;
      nokCables: number;
      workforce: number;
      equivalentKosu: number;
      mudas: number;
    }
    
    

    @Component({
      selector: 'app-kosu-form',
      templateUrl: 'kosu-form.component.html'
    })
    // Define an interface for the line object


    export class KosuFormComponent implements OnInit {

      formDisabled: boolean = true; // Initially disable the form
      showTable: boolean = false;
      selectedDate: string | null = null; // Initialize selectedDate variable
      date = new FormControl();
      groupes: Groupe[] = [];
      timerStatusMessage: string = '';
      serials: Serial[] = [];
      lines: Line[] = [];
      hourlyKosuEntries: HourlyKosuResponse[] = [];
      TimerRunning: boolean = false;
      kosuobjectif!: number; // Initialize with default value
      kosuobjectifedit!:number
    
      editmode:boolean=false;
      // Variables to track dropdown state and selected values
      isGroupDropdownOpen = false;
      isLineDropdownOpen = false;
      selectedGroup: string = "Groupe";
      selectedLine: string = "Ligne";
      selectedLineId:number=0
      selectedSerial: string = 'Série Referance';
      hours: number[] = [];
      allowTimer:boolean=false;
      intervalId:any;

    shiftstartedtimer:boolean=false;

      selectedHour: number | string="Horaire";

      isSerialDropdownOpen = false;
      selectedTeam: string = 'Sélectionner une équipe'; // Variable to hold selected team
      netWorkTime!: number;
      producedCables!: number;
      nokCables!: number;
      workforce!: number;
      selectedGroupId!: number;
      selectedSerialId: any;
      difference: number = 0;
      intervalId2: any;
  


      setSelectedGroup(groupName: string,groupId:number) {
        this.selectedGroup = groupName;
        this.selectedGroupId=groupId;
      }

      setSelectedHour(hour: number) {
        this.selectedHour = hour;
      }
    
    
      toggleEditMode(entry: HourlyKosuResponse) {
        this.editmode=!this.editmode
        entry.editMode = !entry.editMode; // Toggle edit mode flag
      
        if (entry.editMode) {
          // Fetch the entry data from the backend
          this.http.get<any>('http://localhost:9090/hourly-kosu/' + entry.entryId)
            .subscribe(
              (response) => {
                // Prefill the input fields with the fetched entry data
                this.selectedLine = response.line.lineName;
                this.selectedLineId=response.line.lineId;
                this.selectedGroup = response.groupe.groupName;
                
                this.selectedGroupId=response.groupe.groupId
                
                this.selectedHour = response.hour;
                this.selectedSerial = response.serial.serialName;
                this.selectedSerialId=response.serial.serialId;
                this.netWorkTime = response.netWorkTime;
                this.producedCables = response.producedCables;
                this.nokCables = response.nokCables;
                this.workforce = response.workforce;
            
                
              },
              (error) => {
                console.error('Error fetching hourly Kosu entry:', error);
                // Handle error if needed (e.g., display error message)
              }
            );
        }
      }
      
      saveChanges(entry: any) {
        const modifiedData = {
          entryId:entry.entryId,

            lineId: this.selectedLineId,
            serialId: this.selectedSerialId,
            netWorkTime: this.netWorkTime,
            producedCables: this.producedCables,
            nokCables: this.nokCables,
            workforce: this.workforce,
            hour: this.selectedHour,
            groupId: this.selectedGroupId
        }
        const params = {
          kosuobjectifedit: this.kosuobjectifedit
        };

      
      
          this.http.put<any>(`http://localhost:9090/hourly-kosu/${entry.entryId}`, modifiedData,{params}).subscribe(
            (response) => {
              this.toastr.success('Changements sauvegardés avec succès!', 'Success');
              entry.editMode = false; // Toggle back to display mode
          
            },
            (error) => {
              this.toastr.error("Échec de l'enregistrement des modifications !", 'Error');
              console.error('Error saving changes:', error);
            }
          );
          this.fetchHourlyKosuEntries();
        }
      
    
      
      
    setSelectedLine(Line: string, LineId: number) {
    this.selectedLine = Line;
    this.selectedLineId = LineId;
    if (!this.formDisabled) {
      // If the form is enabled (i.e., modifying an existing entry), fetch serials in edit mode
      this.fetchSerials(LineId);
      this.selectedSerial = "Série Referance"; // Reset selected serial
    }}
      
      setSelectedSerial(Serialid:number,serial: string) {
        this.selectedSerial = serial;
        this.selectedSerialId=Serialid
        
      }

      isFormValid(): boolean {
        // Check if all fields are filled in and dropdowns have non-default values
        return this.selectedGroup !== 'Groupe' &&
          this.selectedLine !== 'Ligne' &&
          this.selectedSerial !== 'Série Referance' &&
          this.selectedHour !== 'Horaire' &&
          this.netWorkTime !== undefined &&
          this.producedCables !== undefined &&
          this.nokCables !== undefined &&
          this.workforce !== undefined &&
          this.kosuobjectif!==undefined
      }
      

      // Methods to toggle dropdown visibility
      toggleGroupDropdown() {
        this.isGroupDropdownOpen = !this.isGroupDropdownOpen;
      }

      toggleLineDropdown() {
        this.isLineDropdownOpen = !this.isLineDropdownOpen;
      }

      toggleSerialDropdown() {
        this.isSerialDropdownOpen = !this.isSerialDropdownOpen;
      }

      // Methods to handle selection
      selectGroup(option: string) {
        this.selectedGroup = option;
        this.isGroupDropdownOpen = false;
      }

      selectLine(option: string) {
        this.selectedLine = option;
        this.isLineDropdownOpen = false;
      }

      constructor(private modalService: NgbModal, private http: HttpClient, private toastr:ToastrService) {}
      timerInterval: any;
    

      

      ngOnInit() { 
     
     

     
      
        const timerRunningState = localStorage.getItem('timerRunning');
        if (timerRunningState) {
          this.TimerRunning = JSON.parse(timerRunningState);
        }

        const allowTimerState = localStorage.getItem('allowTimer');
        if (allowTimerState !== null) {
          this.allowTimer = JSON.parse(allowTimerState);
        }

        const timerExpirationString = localStorage.getItem('timerExpiration');
        if (timerExpirationString) {
          this.timerExpiration = new Date(timerExpirationString);
        }
  
        
        const currentShift = localStorage.getItem('currentShift');
        if (currentShift) {
          const shiftData = JSON.parse(currentShift);
          // Assign shift details to selectedDate and selectedTeam
          this.selectedDate = shiftData.date;
          this.selectedTeam = shiftData.shift;
        }
        
    
        this.hours = Array.from({ length: 9 }, (_, i) => i + 1);
    
        this.fetchGroupes();
        this.fetchLines();
        this.fetchSerials(0);

        this.updateTimerStatusMessage();

      



        
        this.updateTimer()
      
          
        
        
        
        const formDisabledState = localStorage.getItem('formDisabled');
      if (formDisabledState) {
        this.formDisabled = JSON.parse(formDisabledState);


      }

    
      

    }

    updateTimer() {
      // Clear the existing interval if it's running
  

      // Check if the interval should be started
      if ( this.allowTimer && (!this.intervalId)) {
          // Start a new interval
          this.intervalId = setInterval(() => {
             
              
              this.updateTimerStatusMessage();
          }, 1000);
      }else{
       
      }
    
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    
  }
      fetchGroupes() {
        this.http.get<any[]>('http://localhost:9090/groupes').subscribe(
          (response) => {
            // Extract groupe properties and assign to groupes array
            this.groupes = response.map(groupe => ({ groupId: groupe.groupId, groupName: groupe.groupName }));
          },
          (error) => {
            console.error('Error fetching groupes:', error);
          }
        );
      }

        
      checkTimer(manualCheck: boolean) {
        const params = { manual: manualCheck };
    
        this.http.post<any>('http://localhost:9090/hourly-kosu/timer/check', {}, { params }).subscribe(
            (response) => {
                this.allowTimer = true;
                localStorage.setItem('allowTimer', JSON.stringify(this.allowTimer));
                // Handle the response if needed
                this.timerExpiration = new Date(response.expirationTime);
                localStorage.setItem('timerExpiration', this.timerExpiration.toString()); // Save timer expiration time to localStorage
    
                if (!manualCheck) {
                  const currentShift = {
                    date: this.selectedDate,
                    shift: this.selectedTeam
                  };
                 
                    this.startTimer(currentShift); // Start the timer when not a manual check
                } 
            },
            (error) => {
                console.error('Error checking timer:', error); // Log error message
                // Handle the error if needed
            }
        );
    }
    
    

    updateTimerStatusMessage() {
      if (this.isTimerRunning() && this.timerExpiration instanceof Date) {
        const now = new Date();
        const expirationTime = this.timerExpiration as Date;
    
        let differenceMs = expirationTime.getTime() - now.getTime();
    
        if (differenceMs < 0) {
          this.timerStatusMessage = 'Temps expiré. Pénalité appliquée.';
          // Here you can add logic to penalize the user and reset the timer
          this.checkTimer(false);
        } else {
          const remainingSeconds = Math.ceil(differenceMs / 1000);
          const remainingMinutes = Math.floor(remainingSeconds / 60);
          const remainingSecondsPart = remainingSeconds % 60;
    
          if (remainingMinutes > 0) {
            this.timerStatusMessage = `Veuillez remplir le formulaire avant ${remainingMinutes} minutes et ${remainingSecondsPart} secondes.`;
          } else {
            this.timerStatusMessage = `Veuillez remplir le formulaire avant ${remainingSecondsPart} secondes.`;
          }
        }
      } else {
        if (!(this.timerExpiration instanceof Date)) {
          this.timerStatusMessage = 'Le Quart est cloturé.';
        } else {
          this.timerStatusMessage = '';
        }
      }
    }
    
      
      
      

      
      
    fetchLines() {
      this.http.get<any[]>('http://localhost:9090/lines').subscribe(
        (response) => {
          // Extract names from objects and assign to lines array
          this.lines = response.map(line => ({ name: line.lineName, id: line.lineId }));
        },
        (error) => {
          console.error('Error fetching lines:', error);
        }
      );
    }
      
    fetchSerials(lineId: number) {
      this.http.get<any[]>(`http://localhost:9090/serials/${lineId}`).subscribe(
        (response) => {
          // Extract serial names from objects and assign to serials array
          this.serials = response.map(serial => ({serialId:serial.serialId,serialName:serial.serialName}));
        },
        (error) => {
          console.error('Error fetching serials:', error);
        }
      );
    }

    startQuart() {
      
      if (!this.isShiftStarterValid()) {
          const config: Partial<IndividualConfig> = {
              positionClass: 'toast-top-center'
          };
          this.toastr.error("Quart Invalide", 'Error', config);
          return;
      }

      const shiftData = {
          date: this.selectedDate,
          shift: this.selectedTeam
      };


      this.http.get<any>(`http://localhost:9090/shifts/check/${this.selectedDate}/${this.selectedTeam}`).subscribe(
          (existingShift) => {
             
              if (existingShift === null) {
                  // Shift does not exist, create a new one

                  // Send POST request to create a new shift
                  this.http.post<any>('http://localhost:9090/shifts', shiftData).subscribe(
                      (response) => {
                        const currentShift = {
                          date: this.selectedDate,
                          shift: this.selectedTeam
                        };
         
                          this.startTimer(currentShift);
                        

                        
                          this.updateTimerStatusMessage();
                          // Handle success response
                          this.toastr.success('Quart démarré avec succès ! ', 'Success');
                          // Additional logic if needed
                          localStorage.setItem('currentShift', JSON.stringify(shiftData));
                          this.toggleForm();
                      },
                      (error) => {
                          // Handle error response
                          this.toastr.error('Probleme de démarrage de Quart!', 'Error');
                          console.error('Error starting shift:', error);
                      }
                  );
              } else {
                  if (existingShift.finished) {
                      // Shift exists but is finished, inform the user and do not start a new one
                      this.toastr.warning('Quart est déjà Terminé. Veuillez en sélectionner un valide.', 'Warning');
                  } else {
                    
                      // Shift exists and is not finished, inform the user and resume working
                      this.toastr.info('Quart a déjà démarré. Reprise du travail.', 'Info');
                      this.toggleForm();
                      if  (!this.isTimerRunning()) {
                        const currentShift = {
                          date: this.selectedDate,
                          shift: this.selectedTeam
                        };
                       

                      this.startTimer(currentShift);
                      
                    
                      
                    
                    }
                      // Additional logic to resume working with the existing shift
                  }
              }
          },
          (error) => {
              console.error('Error checking existing shift:', error);
          }
      );
  }

      
      toggleTable() {
        this.showTable = !this.showTable;
        if (this.showTable) {
          this.fetchHourlyKosuEntries(); // Fetch data when table is toggled on
        }
      }

      toggleForm() {
      
        this.formDisabled = !this.formDisabled;
        this.showTable = false;
        localStorage.setItem('formDisabled', JSON.stringify(this.formDisabled));
        
      }
      isShiftStarterValid(): boolean {
        return this.selectedDate!==null && this.selectedTeam !== 'Sélectionner une équipe'; // Adjust the condition based on your requirements
      }
      onDateSelected() {
        // Handle the selected date
    
      }

      setSelectedTeam(event: Event) {
        const target = event.target as HTMLSelectElement;
        this.selectedTeam = target.value;
    }
    
      finishQuart() {
        const confirmation = window.confirm("Etes-vous sûr de vouloir mettre fin au Quart en cours?");
        if (confirmation){
      
        clearInterval(this.intervalId);
        this.intervalId=false;
      
        this.allowTimer=false;
        localStorage.removeItem('allowTimer');

      
        this.TimerRunning=false;
        localStorage.removeItem('timerExpiration');
        localStorage.removeItem('timerRunning');
        this.formDisabled=true;
        this.showTable=false;
        this.formDisabled = true;
        this.showTable = false;
        localStorage.removeItem('currentShift');
        localStorage.removeItem('formDisabled');
      
        if (this.selectedDate && this.selectedTeam) {
          this.http.put<any>(`http://localhost:9090/shifts/finish/${this.selectedDate}/${this.selectedTeam}`, {}).subscribe(
            (response) => {
              this.toastr.success('Shift finished successfully!', 'Success');
            },(error)=> {this.toastr.success('Shift finished successfully!', 'Success');
          });
        }else this.toastr.error('Invalid shift details!', 'Error');

      }
      }
          
         
          
        
      

        isTimerRunning() {
          return this.TimerRunning;
        }

        onSubmit() {


          const shiftId = {
            date: this.selectedDate,
            shift: this.selectedTeam
          };
          const data = {
            shiftId,
            lineId: this.selectedLineId,
            serialId: this.selectedSerialId,
            netWorkTime: this.netWorkTime,
            producedCables: this.producedCables,
            nokCables: this.nokCables,
            workforce: this.workforce,
            hour: this.selectedHour,
            groupId: this.selectedGroupId,
          };
          const params = {
            kosuobjectif: this.kosuobjectif
          };
          this.http.post<any>('http://localhost:9090/hourly-kosu', data, {params}).subscribe(
            (response) => {
              this.toastr.success('Entrée Kosu créée avec succès!', 'Success');
              this.checkTimer(true)
              
            
          
            },
            (error) => {
              if (error.status === 400 && error.error === 'Error: Duplicate entry violates unique constraint.') {
                this.toastr.error('Duplicate entry violates unique constraint.', 'Error');
              } else {
                this.toastr.error("Échec de la création de l'entrée Kosu!", 'Error');
                console.error('Error creating hourly Kosu entry:', error);
              }
            }
          );
        
          
        }
        timerExpiration: Date | null = null;
        startTimer(currentShift: any) {
          const url = `http://localhost:9090/hourly-kosu/timer/start?date=${currentShift.date}&shift=${currentShift.shift}`;
  
          this.http.post<any>(url, {}).subscribe(
            (response) => {
              // Handle success response
              this.timerExpiration = new Date(response.expirationTime);
              localStorage.setItem('timerExpiration', this.timerExpiration.toString());
              this.TimerRunning = true;
              localStorage.setItem('timerRunning', JSON.stringify(this.TimerRunning));
              this.allowTimer = true;
              localStorage.setItem('allowTimer', JSON.stringify(this.allowTimer));
              this.updateTimer();
            },
            (error) => {
              console.error('Error starting timer:', error); // Log error message
              // Handle the error if needed (e.g., display error message)
            }
          );
        }

        fetchHourlyKosuEntries() {
          // Make an HTTP request to fetch hourly Kosu entries from the backend
          this.http.get<HourlyKosuResponse[]>('http://localhost:9090/hourly-kosu/' + this.selectedDate + '/' + this.selectedTeam)
            .subscribe(
              (response) => {
                // Sort the response by line and then by hour within each line
                response.sort((a, b) => {
                  // First, sort by line
                  if (a.line !== b.line) {
                    return a.line.localeCompare(b.line);
                  }
                  // If line is the same, sort by hour
                  return a.hour - b.hour;
                });
                // Assign the sorted entries to the hourlyKosuEntries array
                this.hourlyKosuEntries = response;
              },
              (error) => {
                console.error('Error fetching hourly Kosu entries:', error);
              }
            );
        }

        refreshTable() {
          // Call the fetchHourlyKosuEntries method to refresh the table data
          this.fetchHourlyKosuEntries();
        }
      
      




    }
