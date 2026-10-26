import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonButtons, IonButton
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButtons,
    IonButton
  ]
})
export class AdminPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public currentSession = this.authService.currentUser;

  public get sessionJson(): string {
    const session = this.currentSession();
    return session ? JSON.stringify(session, null, 2) : '{}';
  }

  public goToUserDashboard(): void {
    this.router.navigate(['/user-dashboard']);
  }

  public handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
