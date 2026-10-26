import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonText
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText
  ]
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public username = '';
  public password = '';
  public errorMessage = '';

  ngOnInit(): void {
    // Si ya existe una sesión activa persistida en sessionStorage, redirigir al panel correspondiente
    if (this.authService.isAuthenticated()) {
      const session = this.authService.currentUser();
      if (session?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    }
  }

  public fillCredentials(user: string, pass: string): void {
    this.username = user;
    this.password = pass;
    this.errorMessage = '';
  }

  public handleLogin(): void {
    this.errorMessage = '';
    const success = this.authService.login(this.username, this.password);

    if (success) {
      const session = this.authService.currentUser();
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];

      if (returnUrl) {
        // Si el usuario intentó acceder a /admin pero su rol es 'user', redirigir a user-dashboard
        if (returnUrl.startsWith('/admin') && session?.role === 'user') {
          this.router.navigate(['/user-dashboard']);
          return;
        }
        this.router.navigateByUrl(returnUrl);
        return;
      }

      // Redirección por defecto según rol asignado
      if (session?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.errorMessage = 'Credenciales no autorizadas. Use admin / 123 o operador / 123';
    }
  }
}
