import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

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
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(4)]],
      passwordConfirm: [null, [Validators.required, Validators.minLength(4)]],
    });
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
