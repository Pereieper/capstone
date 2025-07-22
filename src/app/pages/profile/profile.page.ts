import { Component } from '@angular/core';
import { RegistrationService } from 'src/app/services/registration.service';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ProfilePage {
  user: any = {};
  isEditing = false;
  isContactModalOpen = false;

  constructor(
    private registrationService: RegistrationService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back(); 
  }

  ionViewWillEnter() {
    this.user = this.registrationService.getCurrentUser();
  }

  async toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      await this.registrationService.updateUser(this.user);
      this.presentToast('✅ Changes saved successfully.', 'success');
    }
  }

  openContactModal() {
    if (this.isEditing) {
      this.isContactModalOpen = true;
    }
  }

  closeModal() {
    this.isContactModalOpen = false;
  }

  updateContactNumber(newNumber: string) {
    this.user.contact = newNumber;
    this.closeModal();
    this.presentToast('📱 Contact number updated!', 'success');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }
}
