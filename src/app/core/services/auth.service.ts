import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clave empleada en la Web Storage API
  private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';

  // Signal reactivo para el estado en memoria
  private _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

  // Selectores computados de solo lectura expuestos a la aplicación
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);

  /**
   * Valida credenciales requeridas:
   * - admin / 123 (Rol: 'admin')
   * - operador / 123 (Rol: 'user')
   */
  public login(user: string, pass: string): boolean {
    let sessionData: UserSession | null = null;

    if (user === 'admin' && pass === '123') {
      sessionData = {
        username: user,
        role: 'admin',
        isAuthenticated: true
      };
    } else if (user === 'operador' && pass === '123') {
      sessionData = {
        username: user,
        role: 'user',
        isAuthenticated: true
      };
    }

    if (sessionData) {
      // 1. Guardar en memoria reactiva
      this._currentUser.set(sessionData);

      // 2. Persistir en el navegador (Web Storage API)
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));

      return true;
    }

    return false;
  }

  /**
   * Destruye la sesión activa en memoria y en almacenamiento local
   */
  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._currentUser.set(null);
  }

  /**
   * Recupera la sesión al refrescar la página
   */
  private readSessionFromStorage(): UserSession | null {
    const rawData = sessionStorage.getItem(this.STORAGE_KEY);
    if (!rawData) {
      return null;
    }
    try {
      return JSON.parse(rawData) as UserSession;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}
