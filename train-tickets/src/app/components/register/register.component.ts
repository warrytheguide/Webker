import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private firestore: Firestore
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, password } = this.registerForm.value;
      
      this.authService.register(email, password).subscribe({
        next: (credential) => {
          const isAdmin = email === 'admin@admin.com';
          const user = credential.user;
          
          const userRef = doc(this.firestore, 'users', user.uid);
          setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            admin: isAdmin,
            createdAt: new Date(),
            purchasedTickets: [] // Initialize empty purchased tickets array
          }).catch(err => console.error('Error saving user data:', err));
          
          this.isLoading = false;
          this.snackBar.open(isAdmin ? 'Admin account created!' : 'Registration successful!', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.router.navigate(['/tickets']);
        },
        error: (error) => {
          this.isLoading = false;
          
          // Provide user-friendly error messages
          let errorMessage = 'An error occurred during registration. Please try again.';
          
          if (error.code) {
            switch (error.code) {
              case 'auth/email-already-in-use':
                errorMessage = 'This email is already registered. Please use a different email or try logging in.';
                break;
              case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
              case 'auth/operation-not-allowed':
                errorMessage = 'Email/password registration is not enabled. Please contact support.';
                break;
              case 'auth/weak-password':
                errorMessage = 'Your password is too weak. Please choose a stronger password.';
                break;
              case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your internet connection and try again.';
                break;
              case 'auth/too-many-requests':
                errorMessage = 'Too many requests. Please try again later.';
                break;
              default:
                errorMessage = `Registration failed: ${error.message}`;
            }
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
        }
      });
    } else {
      // Form validation errors
      if (this.registerForm.hasError('passwordMismatch')) {
        this.snackBar.open('Passwords do not match', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
      this.registerForm.markAllAsTouched();
    }
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
