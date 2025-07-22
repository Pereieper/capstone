import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-secretary-dashboard',
  templateUrl: './secretary-dashboard.page.html',
  styleUrls: ['./secretary-dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SecretaryDashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
