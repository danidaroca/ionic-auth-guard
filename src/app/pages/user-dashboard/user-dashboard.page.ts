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
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
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
export class UserDashboardPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public currentSession = this.authService.currentUser;
  public feedbackMessage = '';

  public get sessionJson(): string {
    const session = this.currentSession();
    return session ? JSON.stringify(session, null, 2) : '{}';
  }

  public async testDirectAdminAccess(): Promise<void> {
    this.feedbackMessage = 'Intentando acceder a /admin...';
    // Intento de navegación interceptado por roleGuard('admin')
    await this.router.navigate(['/admin']);
    this.feedbackMessage = '⛔ [ACCESO DENEGADO POR ROLEGUARD]: No tienes permisos de administrador. Redirección interceptada y devuelta a /user-dashboard.';
  }

  public handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
