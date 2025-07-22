import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { DocumentRequestService } from 'src/app/services/document-request.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Component({
  selector: 'app-request-document',
  templateUrl: './request-document.page.html',
  styleUrls: ['./request-document.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // ✅ Already includes IonContent, IonHeader, etc.
  ],
})
export class RequestDocumentPage implements OnInit {
  documentType = '';
  purpose = '';
  customPurpose = '';
  numberOfCopies: number = 1;
  requirements = '';
  photo: string = '';
  uploadedPhoto: string | null = null; // ✅ FIXED: Add this line
  dateNow: string = '';
  timeNow: string = '';

  documentOptions = [
    'Barangay Clearance',
    'Certificate of Residency',
    'Certificate of Indigency',
    'Barangay ID',
    'Other',
  ];

  purposeOptions = [
    'Employment',
    'School Requirement',
    'Financial Assistance',
    'Personal Use',
    'Others',
  ];

  constructor(
    private navCtrl: NavController,
    private requestService: DocumentRequestService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const now = new Date();
    this.dateNow = now.toLocaleDateString();
    this.timeNow = now.toLocaleTimeString();
  }

  onCancel() {
    this.navCtrl.back();
  }

  async onContinue() {
    if (this.purpose === 'Others' && !this.customPurpose.trim()) {
      alert('Please specify your purpose.');
      return;
    }

    if (this.numberOfCopies < 1) {
      alert('Number of copies must be at least 1.');
      return;
    }

    const finalPurpose =
      this.purpose === 'Others' ? this.customPurpose : this.purpose;

    const requestData = {
      documentType: this.documentType,
      purpose: finalPurpose,
      copies: this.numberOfCopies,
      requirements: this.requirements,
      photo: this.photo,
      timestamp: new Date().toISOString(),
    };

    await this.requestService.addRequest(requestData);

    const successAlert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Your request has been submitted.',
      buttons: ['OK'],
    });

    await successAlert.present();
    this.resetForm();
  }

  async takePhoto() {
  try {
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt  // ✅ Allows Camera or Photo Library
    });

    this.uploadedPhoto = image.dataUrl || null;
  } catch (error) {
    console.error('Failed to get photo', error);
  }
}


  resetForm() {
    this.documentType = '';
    this.purpose = '';
    this.customPurpose = '';
    this.numberOfCopies = 1;
    this.requirements = '';
    this.photo = '';
  }
}
