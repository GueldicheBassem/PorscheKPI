// system-management.component.ts

import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from '../../_services/project-service.service';
import { Groupe,GroupService } from '../../_services/group-service.service';
import { LineService,Line } from '../../_services/line-service.service';
import { Serial, SerialService } from '../../_services/serial-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-system-management',
  templateUrl: './system-management.component.html',
})
export class SystemManagementComponent implements OnInit {
  activeForm: string | null = null;
  newProject: Project = { projectName: '' }; // New project object
  editProject: Project = { projectName: '' }; // Project object for editing
  projects: Project[] = []; // Array to hold all projects
  searchTerm: string = '';
  newGroup: Groupe = { groupName: '' }; // New group object
  editGroup: Groupe = { groupName: '' }; // Group object for editing
  editSerial: Serial = { serialName: '', reference: '', coefficient: 0, project: null }; // Serial object for editing


  groups: Groupe[] = []; // Array to hold all groups
  searchGroupTerm: string = '';
  newLine: Line = { lineName: '', project: null }; // New line object
  editLine: Line = { lineName: '', project: null }; // Line object for editing
  lines: Line[] = []; // Array to hold all lines
  selectedProject: Project | null = null; // Selected project from the dropdown
  searchLineTerm: string = '';
  newSerial: Serial = { serialName: '', reference: '', coefficient: 0 }; // New serial object

  serials: Serial[] = []; // Array to hold all serials
  editLineForm!: FormGroup;
  editSerialForm!: FormGroup;

  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private projectService: ProjectService,
    private groupService: GroupService,
    private lineService: LineService,
    private serialService: SerialService,
  ) {}

  ngOnInit() {
    this.getAllProjects();
    this.getAllGroups();
    this.getAllLines();
    this.getAllSerials();

    this.editLineForm = this.formBuilder.group({
      lineName: ['', Validators.required],
      project: ['', Validators.required]
    });
    this.editSerialForm = this.formBuilder.group({
      serialName: ['', Validators.required],
      reference: [''], // Add validators as needed
      coefficient: [0,Validators.required], // Example for number field
      project: ['', Validators.required] // Example for project field
    });
  
  
  
  
  
  }

   

  toggleForm(formName: string, item?: any) {
    this.activeForm = this.activeForm === formName ? null : formName;
    if (this.isProject(item)) {
      this.editProject = { ...item }; // Copy project data for editing
    } else if (this.isGroupe(item)) {
      this.editGroup = { ...item }; // Copy group data for editing
    }  else if (this.isLine(item)) {


     

      this.editLine = { ...item  }; // Copy line data for editing
      this.editLineForm.patchValue({ lineName: this.editLine.lineName,project:this.editLine.project });
    } else if (this.isSerial(item)) {
      this.editSerial = { ...item, project: item.project ? { ...item.project } : null }; // Copy serial data for editing

      this.editSerialForm.patchValue({
        serialName: this.editSerial.serialName,
        reference: this.editSerial.reference,
        coefficient: this.editSerial.coefficient,
        project: this.editSerial.project
        
        
      });
      console.log(this.editSerial.project)
      
    }}
    compareProjects(project1: any, project2: any): boolean {
      return project1 && project2 ? project1.projectId === project2.projectId : project1 === project2;
    }
    private isSerial(item: any): item is Serial {
      return item && item.serialName !== undefined;
    }
  
  private isLine(item: any): item is Line {
    return item && item.lineName !== undefined;
  } 
  
  private isProject(item: any): item is Project {
    return item && item.projectName !== undefined;
  }
  
  private isGroupe(item: any): item is Groupe {
    return item && item.groupName !== undefined;
  }
  loadSerials() {
    this.serialService.getAllSerials().subscribe(
      (serials) => {
        this.serials = serials;
      },
      (error) => {
        console.error('Error loading serials:', error);
      }
    );
  }

  submitSerialForm() {
    if (this.selectedProject) {
        this.newSerial.project = this.selectedProject;
        // Call service to create a new serial
        this.serialService.createSerial(this.newSerial).subscribe(
            (res) => {
                console.log('Serial created:', res);
                this.loadSerials();
                this.newSerial = { serialName: '', reference: '', coefficient: 0 }; // Reset new serial object
                this.selectedProject = null; // Reset selected project
                this.activeForm = 'serials';
            },
            (error) => {
                console.error('Error creating serial:', error);
            }
        );
    } else {
        console.error('No project selected for the serial.');
    }
}


updateSerialForm() {
  if (this.editSerialForm.valid) {
    // Extract form values
    const updatedSerial = {
      serialName: this.editSerialForm.value.serialName,
      reference: this.editSerialForm.value.reference,
      coefficient: this.editSerialForm.value.coefficient,
      project: this.editSerialForm.value.project
    };
    // Call the service to update the serial
    this.serialService.updateSerial(this.editSerial.serialId || 0, updatedSerial).subscribe(
      (res) => {
        console.log('Serial updated:', res);
        this.loadSerials(); // Refresh the serial list
        this.activeForm = 'serials'; // Switch back to the serials list
      },
      (error) => {
        console.error('Error updating serial:', error);
        // Handle error appropriately
      }
    );
  }}

  deleteSerial(serialId: number) {
    if (serialId) {
      this.serialService.deleteSerial(serialId).subscribe(
        () => {
          console.log('Serial deleted successfully');
          this.loadSerials();
        },
        (error) => {
          console.error('Error deleting serial:', error);
        }
      );
    } else {
      console.error('Invalid serial ID.');
    }
  }

  

 


  getAllSerials() {
    this.serialService.getAllSerials().subscribe(
      (serials) => {
        console.log('Serials fetched:', serials);
        this.serials = serials;
      },
      (error) => {
        console.error('Error fetching serials:', error);
      }
    );
  }

  get filteredSerials(): Serial[] {
    return this.serials.filter(serial =>
      serial.serialName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  submitProjectForm() {
    // Call service to create a new project
    this.projectService.createProject(this.newProject).subscribe(
      (res) => {
        console.log('Project created:', res);
        this.getAllProjects(); // Refresh the project list
        // Optionally, reset form or perform any other action after successful creation
        this.newProject = { projectName: '' };
        this.activeForm = 'projects'; // Switch back to the projects list
      },
      (error) => {
        console.error('Error creating project:', error);
        // Handle error appropriately
      }
    );
  }
  updateLineForm() {
    if (this.editLineForm.valid) {
   
      const updatedLine = {
        lineName: this.editLineForm.value.lineName,
        project: this.editLineForm.value.project
      };
      console.log(updatedLine);
      console.log(this.editLine.lineId);
    // Call the service to update the line
    this.lineService.updateLine(this.editLine.lineId || 0, updatedLine).subscribe(
      (res) => {
        console.log('Line updated:', res);
        this.getAllLines(); // Refresh the line list
        this.activeForm = 'lines'; // Switch back to the lines list
      },
      (error) => {
        console.error('Error updating line:', error);
        this.toastr.error("Project already assigned to another line!");

        // Handle error appropriately
      }
    );
  }
  
  }
  
  get filteredLines(): Line[] {
    return this.lines.filter(line =>
      line.lineName && line.lineName.toLowerCase().includes(this.searchLineTerm.toLowerCase())
    );
  }

  getAllLines() {
    // Call service to get all lines
    this.lineService.getAllLines().subscribe(
      (lines) => {
        console.log('Lines fetched:', lines);
        this.lines = lines; // Assign fetched lines to the local variable
      },
      (error) => {
        console.error('Error fetching lines:', error);
        // Handle error appropriately
      }
    );
  }

  deleteLine(lineId: number) {
    if (lineId) {
      this.lineService.deleteLine(lineId).subscribe(
        () => {
          console.log('Line deleted successfully');
          // Reload lines after deletion
          this.loadLines();
        },
        (error) => {
          console.error('Error deleting line:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.error('Invalid line ID');
    }
  }

  loadLines() {
    this.lineService.getAllLines().subscribe(
      (lines) => {
        this.lines = lines;
      },
      (error) => {
        console.error('Error loading lines:', error);
        // Handle error appropriately
      }
    );
  }

  submitLineForm() {
    // Ensure a project is selected before submitting
    if (this.selectedProject) {
        console.log('Selected Project:', this.selectedProject); // Log the selected project
        console.log('New Line before assignment:', this.newLine); // Log new line object before assignment
        // Set the selected project to the new line object
        this.newLine.project = this.selectedProject;
        console.log('New Line after assignment:', this.newLine); // Log new line object after assignment
        // Call service to create a new line
        this.lineService.createLine(this.newLine).subscribe(
            (res) => {
                console.log('Line created:', res);
                this.getAllLines(); // Refresh the line list
                // Optionally, reset form or perform any other action after successful creation
                this.newLine = { lineName: '', project: null }; // Reset new line object
                this.activeForm = 'lines'; // Switch back to the lines list
            },
            (error) => {
              this.toastr.error("Project already assigned to another line!");

                console.error('Error creating line:', error);
                // Handle error appropriately
            }
        );
    } else {
        console.error('No project selected for the line.');
    }
}

  

  submitGroupForm() {
    // Call service to create a new group
    this.groupService.createGroup(this.newGroup).subscribe(
      (res) => {
        console.log('Group created:', res);
        this.getAllGroups(); // Refresh the group list
        // Optionally, reset form or perform any other action after successful creation
        this.newGroup = { groupName: '' };
        this.activeForm = 'groups'; // Switch back to the groups list
      },
      (error) => {
        console.error('Error creating group:', error);
        // Handle error appropriately
      }
    );
  }

  updateProjectForm() {
    // Call service to update the project
    this.projectService.updateProject(this.editProject.projectId || 0, this.editProject).subscribe(
      (res) => {
        console.log('Project updated:', res);
        this.getAllProjects(); // Refresh the project list
        this.activeForm = 'projects'; // Switch back to the projects list
      },
      (error) => {
        console.error('Error updating project:', error);
        // Handle error appropriately
      }
    );
  }

  updateGroupForm() {
    // Call service to update the group
    this.groupService.updateGroup(this.editGroup.groupId || 0, this.editGroup).subscribe(
      (res) => {
        console.log('Group updated:', res);
        this.getAllGroups(); // Refresh the group list
        this.activeForm = 'groups'; // Switch back to the groups list
      },
      (error) => {
        console.error('Error updating group:', error);
        // Handle error appropriately
      }
    );
  }

  deleteProject(projectId: number) {
    if (projectId) {
      this.projectService.deleteProject(projectId).subscribe(
        () => {
          console.log('Project deleted successfully');
          // Reload projects after deletion
          this.loadProjects();
        },
        (error) => {
          console.error('Error deleting project:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.error('Invalid project ID');
    }
  }

  deleteGroup(groupId: number) {
    if (groupId) {
      this.groupService.deleteGroup(groupId).subscribe(
        () => {
          console.log('Group deleted successfully');
          // Reload groups after deletion
          this.loadGroups();
        },
        (error) => {
          console.error('Error deleting group:', error);
          // Handle error appropriately
        }
      );
    } else {
      console.error('Invalid group ID');
    }
  }

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (projects) => {
        this.projects = projects;
      },
      (error) => {
        console.error('Error loading projects:', error);
        // Handle error appropriately
      }
    );
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe(
      (groups) => {
        this.groups = groups;
      },
      (error) => {
        console.error('Error loading groups:', error);
        // Handle error appropriately
      }
    );
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(project =>
      project.projectName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredGroups(): Groupe[] {
    return this.groups.filter(group =>
      group.groupName && group.groupName.toLowerCase().includes(this.searchGroupTerm.toLowerCase())
    );
  }
  

  getAllProjects() {
    // Call service to get all projects
    this.projectService.getAllProjects().subscribe(
      (projects) => {
        console.log('Projects fetched:', projects);
        this.projects = projects; // Assign fetched projects to the local variable
      },
      (error) => {
        console.error('Error fetching projects:', error);
        // Handle error appropriately
      }
    );
  }

  getAllGroups() {
    // Call service to get all groups
    this.groupService.getAllGroups().subscribe(
      (groups) => {
        console.log('Groups fetched:', groups);
        this.groups = groups; // Assign fetched groups to the local variable
      },
      (error) => {
        console.error('Error fetching groups:', error);
        // Handle error appropriately
      }
    );
  }
}
