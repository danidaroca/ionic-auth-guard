import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should redirect unauthenticated user to /login with returnUrl', () => {
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.queryParams['returnUrl']).toBe('/admin');
  });

  it('should allow access when user is authenticated', () => {
    authService.login('admin', '123');
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
    expect(result).toBe(true);
  });
});
