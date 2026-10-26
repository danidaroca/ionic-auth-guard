import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no authenticated user when storage is empty', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should successfully log in admin user with role admin', () => {
    const success = service.login('admin', '123');
    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.username).toBe('admin');
    expect(service.currentUser()?.role).toBe('admin');
    expect(sessionStorage.getItem('DAM2_AUTH_SESSION')).toBeTruthy();
  });

  it('should successfully log in operador user with role user', () => {
    const success = service.login('operador', '123');
    expect(success).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.username).toBe('operador');
    expect(service.currentUser()?.role).toBe('user');
    expect(sessionStorage.getItem('DAM2_AUTH_SESSION')).toBeTruthy();
  });

  it('should reject invalid credentials', () => {
    const success = service.login('admin', 'wrong_pass');
    expect(success).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should clear reactive signal and sessionStorage on logout', () => {
    service.login('admin', '123');
    expect(service.isAuthenticated()).toBe(true);
    service.logout();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem('DAM2_AUTH_SESSION')).toBeNull();
  });
});
