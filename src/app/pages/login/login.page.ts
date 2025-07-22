import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class LoginPage {
  phone: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const savedPhone = localStorage.getItem('savedPhone');
    if (savedPhone) {
      this.phone = savedPhone;
      this.rememberMe = true;
    }
  }

  async login() {
    if (!this.phone || !this.password) {
      this.presentToast('⚠️ Please enter phone and password', 'warning');
      return;
    }

    const formattedPhone = this.phone.startsWith('0')
      ? '+63' + this.phone.slice(1)
      : this.phone;

const user = await this.registrationService.checkLogin(formattedPhone, this.password);

    if (user) {
      this.presentToast('✅ Login successful!', 'success');

      if (this.rememberMe) {
        localStorage.setItem('savedPhone', this.phone);
      } else {
        localStorage.removeItem('savedPhone');
      }

      await this.registrationService.setCurrentUser(user);

      switch (user.role) {
        case 'secretary':
          this.router.navigate(['/secretary-dashboard']);
          break;
        case 'captain':
          this.router.navigate(['/captain-dashboard']);
          break;
        default:
          this.router.navigate(['/resident-dashboard']);
      }
    } else {
      this.presentToast('❌ Invalid phone or password.', 'danger');
    }
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/registration']);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
