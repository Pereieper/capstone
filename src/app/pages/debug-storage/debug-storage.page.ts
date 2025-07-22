import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-debug-storage',
  templateUrl: './debug-storage.page.html',
  styleUrls: ['./debug-storage.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,IonCardContent]
})
export class DebugStoragePage implements OnInit {
  storageDump: string = '';

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    this.storageDump = await this.storageService.exportData();
  }
}
