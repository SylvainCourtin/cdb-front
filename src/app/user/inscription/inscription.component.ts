import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {User} from '../user.model';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';

@Component({
  selector: 'cdb-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  animations: [
    trigger('Animation', [
      state('init', style({opacity: 1, transform: 'translateX(0)'})),
      transition('void => init', [
        style({
          opacity: 0,
          transform: 'translateX(-50%)'
        }),
        animate('0.4s ease-in')
      ])
    ])
  ]
})
export class InscriptionComponent implements OnInit {
  userForm: FormGroup;

  constructor(private userService: UserService, private router: Router,  private fb: FormBuilder, private appService: AppService) {
    this.createForm();
    this.appService.changeTitle('SIGNUP.NAME');
  }

  ngOnInit() {
  }

  private passwordConfirm(c: AbstractControl) {
    if (c.get('password').value !== c.get('confirm_password').value) {
      c.get('confirm_password').setErrors({MatchPassword: true});
    } else {
      return null;
    }
  }

  private createForm() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirm_password: ['', Validators.required]
      }, {validator: this.passwordConfirm}),
    });
  }

  signUp() {
    const user = new User(this.userForm.get('username').value, this.userForm.get(['passwords', 'password']).value);
    localStorage.removeItem(UserService.token_key);
    this.userService.signUp(user).subscribe(res => this.setSession(res), error => {
      console.log(error);
    });
  }

  private setSession(res) {
    localStorage.setItem(UserService.token_key, res.token);
    this.router.navigate(['/computer']).catch();
  }

}
