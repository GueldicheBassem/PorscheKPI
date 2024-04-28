import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

export interface User {
  userName: string;
  userPassword: string;
  name: string;
  lastname: string;
  matricule: number;
  penaltypoints: number;
  role: Role[];
  superiorEmail?: string; // Add superiorEmail as an optional field
}

// role.interface.ts
export interface Role {
  roleName: string;
  roleDescription: string;
}
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedUserForEdit: any={
    userName: '',
    userPassword: '',
    name: '',
    lastname: '',
    matricule: null,
    role: null, // Set to null or provide default role if applicable
    superiorEmail: ''


  };
  showCreateUserForm: boolean = false;
  newUser: any = {
    userName: '',
    userPassword: '',
    name: '',
    lastname: '',
    matricule: null,
    role: null, // Set to null or provide default role if applicable
    superiorEmail: ''
  };
 
  showEditForm: boolean = false; // Flag to toggle visibility of edit form
  
  roles: any[] = [];
  userForm!: FormGroup;
  selectedRole: any = {}; // Change to object to properly handle the selected role
  previousUsername: string='';

  constructor(private http: HttpClient,private formBuilder: FormBuilder,private toastr:ToastrService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles(); // Load roles when component initializes

    this.userForm = this.formBuilder.group({
      userName: ['', Validators.required],
      userPassword: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      matricule: [null, Validators.required],
      penaltypoints: [0, Validators.required],
      superiorEmail: [''],
      role: [null, Validators.required]
    });
    
  }

  setFormValues(user: User) {
    this.userForm.patchValue({
      userName: user.userName,
      userPassword: '',
      name: user.name,
      lastname: user.lastname,
      matricule: user.matricule,
      penaltypoints: user.penaltypoints,
      superiorEmail: user.superiorEmail,
      role: [user.role] // Assuming role is an object
    });
  }

  isFormValid(): boolean {
    // Check if all fields are filled in and dropdowns have non-default values
    return this.newUser.username !== '' &&
      this.newUser.name !== '' &&
      this.newUser.lastname !== '' &&
      this.newUser.matricule !== '' &&
      this.newUser.userPassword !== '' &&
      this.selectedRole !== null 
  }
  


  loadUsers() {
    this.http.get<any[]>('http://localhost:9090/users').subscribe(users => {
      // Map users to display only required properties
      this.users = users.map(user => ({
        userName: user.userName,
        Matricule: user.matricule, 
        Name: user.name, 
        Lastname: user.lastname, 
        PenaltyPoints: user.penaltypoints,
        Roles: user.role.map((role: { roleName: any; }) => role.roleName).join(', ')
      }));
      
      this.filteredUsers = this.users; // Initialize filteredUsers
    });
  }

  loadRoles() {
    this.http.get<any[]>('http://localhost:9090/roles').subscribe(roles => {
      this.roles = roles;
    });
  }

  openCreateUserForm() {
    this.showCreateUserForm = true;
    this.resetNewUser(); // Reset newUser object when the form is opened
    this.selectedRole = null;
  }

  createUser() {
    // Assign the selected role to newUser
    this.newUser.role = [this.selectedRole]; // Pass the selected role object directly
    this.http.post<any>('http://localhost:9090/registerNewUser', this.newUser).subscribe(response => {
      console.log('User created successfully:', response);
      this.showCreateUserForm = false; // Hide the form after successful creation
      // Refresh the user list
      this.loadUsers();
    }, error => {
      console.error('Error creating user:', error);
    });
  }
  

  deleteUser(userName: string) {
    this.http.delete<any>('http://localhost:9090/deleteUser/' + userName).subscribe(response => {
        console.log('User deleted successfully:', response);
        // Refresh the user list
        this.loadUsers();
    }, error => {
        console.error('Error deleting user:', error);
    });
  }

  

  
  resetNewUser() {
    this.newUser = {
      userName: '',
      userPassword: '',
      name: '',
      lastname: '',
      matricule: '',
      role: null
    };
  }
  
  onSearch() {
    // Filter users based on search term matching either name or lastname
    this.filteredUsers = this.users.filter(user =>
      user.Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.Lastname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  selectedUser: User = {
    userName: '',
    userPassword: '',
    name: '',
    lastname: '',
    matricule: 0, // or whatever default value you want
    penaltypoints: 0, // or whatever default value you want
    role: [],
    superiorEmail: '' // or whatever default value you want
  };
  


  // Method to toggle the edit form and set the selected user
  toggleEditForm(user: User) {
    // Fetch user information by username
    this.http.get<User>('http://localhost:9090/getUser/' + user.userName).subscribe(response => {


      this.setFormValues(response);
      this.previousUsername=user.userName;
  
     
  
  
      // Toggle the edit form
      this.showEditForm = true;
    });
  }
  
  

  // Method to cancel the update operation and hide the edit form
  cancelUpdate() {
    this.showEditForm = false;
    // Clear the selectedUser object
    this.selectedUser = {
        userName: '',
        userPassword: '',
        name: '',
        lastname: '',
        matricule: 0,
        penaltypoints: 0,
        role: [],
        superiorEmail: ''
    };
   
}

  // Method to update the user

  updateUser() {
    if (this.userForm.invalid) {
      // If the form is invalid, do not proceed with user creation
      this.toastr.error("Veuillez remplir tous les champs requis !", 'Error');
      return;
    }
    const updatedUser = this.userForm.value;
    // Wrap the role in an array
    updatedUser.role = [this.userForm.value.role];
    console.log("will be updating ,", this.previousUsername, "with", updatedUser);
    console.log(this.previousUsername);
    console.log(updatedUser);
  
    this.http.put<any>('http://localhost:9090/updateUser/' + this.previousUsername, updatedUser).subscribe(response => {
      console.log('User updated successfully:', response);
      this.loadUsers();
      this.showEditForm = false;
    }, error => {
      console.error('Error updating user:', error);
    });
  }
  
  
}
