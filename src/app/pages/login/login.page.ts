import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn().then(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/tabs/home']);
      }
    });
  }

  async login(formValues: any) {
    const { username, password } = formValues;
    const loadingIndicator = await this.showLoadingIndictator();

    try {
      console.log('trying to login');
      const result = await this.authService.login(username, password);
      this.authService.handleLoginCallback(null, result);
    } catch (e: any) {
      console.log('login error');

      this.errorMessage = e.message;
      this.authService.handleLoginCallback(e, null);
    } finally {
      loadingIndicator.dismiss();
    }
  }

  gotoSignup(){
    this.router.navigateByUrl('/user/signup');
  }

  private async showLoadingIndictator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Opening login window...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }
}
