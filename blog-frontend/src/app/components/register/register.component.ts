import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

export class CustomValidation {
  static passwordValidateforNumbers(
    constrols: AbstractControl
  ): ValidationErrors {
    const regex = /\d/;
    if (regex.test(constrols.value) && constrols.value !== null) {
      return { passwordInvalid: false };
    } else {
      return { passwordInvalid: true };
    }
  }

  static passwordMatchValidation(controls: AbstractControl): ValidationErrors {
    const password = controls.get('password')?.value;
    const confirmPassword = controls.get('passwordConfirm')?.value;

    if (
      password === confirmPassword &&
      password !== null &&
      confirmPassword !== null
    ) {
      return { passwordUnmatch: false };
    } else {
      return { passwordNotmatch: true };
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    private authService: AuthService,
    private route: Router,
    private formBuilder: FormBuilder
  ) {
    this.signupForm = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        username: [null, [Validators.required]],
        email: [null, [Validators.required]],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(4),
            // CustomValidation.passwordValidateforNumbers,
          ],
        ],
        passwordConfirm: [
          null,
          [
            Validators.required,
            Validators.minLength(4),
            // CustomValidation.passwordValidateforNumbers,
          ],
        ],
      },
      {
        // Validators: CustomValidation.passwordMatchValidation,
      }
    );
  }

  ngOnInit(): void {}

  onsubmitForm() {
    if (this.signupForm.invalid) {
      return;
    }
    console.log('form value', this.signupForm.value);
    this.authService
      .register(this.signupForm.value)
      .pipe(
        map((user) => {
          console.log('user', user);
          this.route.navigate(['login']);
        })
      )
      .subscribe();
  }
}
