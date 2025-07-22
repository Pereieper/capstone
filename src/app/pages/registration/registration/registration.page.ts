import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationService } from 'src/app/services/registration.service';
import { ToastController } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegistrationPage {
  // Form fields
  firstName = '';
  middleName = '';
  lastName = '';
  dob = '';
  gender = '';
  civilStatus = '';
  contact = '';
  purok = '';
  barangay = '';
  city = '';
  province = '';
  postalCode = '';
  password = '';
  confirmPassword = '';
  photo: string | null = null;

  // Validation flags
  passwordError = false;
  confirmError = false;

  showPassword = false;
  showConfirm = false;

  constructor(
    private registrationService: RegistrationService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmVisibility() {
    this.showConfirm = !this.showConfirm;
  }

  validatePassword() {
    const hasUpper = /[A-Z]/.test(this.password);
    const hasLower = /[a-z]/.test(this.password);
    const hasSpecial = /[\W_]/.test(this.password);
    const isLongEnough = this.password.length >= 8;

    this.passwordError = !(hasUpper && hasLower && hasSpecial && isLongEnough);
  }

  async register() {
    this.validatePassword();
    this.confirmError = this.password !== this.confirmPassword;

    if (this.passwordError || this.confirmError) {
      await this.presentToast('❌ Please fix password errors', 'danger');
      return;
    }

    if (!this.firstName || !this.lastName || !this.contact || !this.gender || !this.dob || !this.password) {
      await this.presentToast('⚠️ Please fill in all required fields', 'warning');
      return;
    }

    // Format contact number to international format +63
    const formattedContact = this.contact.startsWith('0') ? '+63' + this.contact.slice(1) : this.contact;

    const isDupContact = await this.registrationService.isDuplicateContact(formattedContact);
    const isDupName = await this.registrationService.isDuplicateName(this.firstName, this.middleName, this.lastName);

    if (isDupContact || isDupName) {
      await this.presentToast('⚠️ Duplicate record found', 'danger');
      return;
    }

    const encryptedPassword = CryptoJS.SHA256(this.password).toString();

    const newRecord = {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      dob: this.dob,
      gender: this.gender,
      civilStatus: this.civilStatus,
      contact: formattedContact,
      purok: this.purok,
      barangay: this.barangay,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
      password: encryptedPassword,
      photo: this.photo,
    };

    await this.registrationService.saveOfflineRegistration(newRecord);
    await this.presentToast('✅ Registered successfully!', 'success');

    this.clearForm();
    this.router.navigate(['/login']); // Optional: Redirect after registration
  }

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      this.photo = image.dataUrl || null;
    } catch (error) {
      await this.presentToast('❌ Failed to take photo.', 'danger');
      console.error(error);
    }
  }

  clearForm() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.dob = '';
    this.gender = '';
    this.civilStatus = '';
    this.contact = '';
    this.purok = '';
    this.barangay = '';
    this.city = '';
    this.province = '';
    this.postalCode = '';
    this.password = '';
    this.confirmPassword = '';
    this.photo = null;
    this.passwordError = false;
    this.confirmError = false;
    this.showPassword = false;
    this.showConfirm = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    await toast.present();
  }

  async testView() {
  const all = await this.registrationService.getAllRegistrations();
  console.log('📄 All registrations:', all);
}

}
