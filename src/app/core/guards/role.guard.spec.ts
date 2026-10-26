import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
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

  it('should redirect unauthenticated user to /login', () => {
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.queryParams['returnUrl']).toBe('/admin');
  });

  it('should allow access to /admin when user has admin role', () => {
    authService.login('admin', '123');
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
    expect(result).toBe(true);
  });

  it('should deny access to /admin and redirect to /user-dashboard when user has user role', () => {
    authService.login('operador', '123');
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/admin' } as RouterStateSnapshot;

    const guard = roleGuard('admin');
    const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(router.serializeUrl(urlTree)).toBe('/user-dashboard');
  });

  it('should allow access to /user-dashboard when user has user role', () => {
    authService.login('operador', '123');
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/user-dashboard' } as RouterStateSnapshot;

    const guard = roleGuard('user');
    const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
    expect(result).toBe(true);
  });
});
