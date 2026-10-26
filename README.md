# Control de Acceso y Protección de Rutas con Ionic, Angular Standalone y Functional Guards

**Módulo Profesional:** Desarrollo de Interfaces (Código: 0488)  
**Ciclo Formativo:** 2º Curso DAM (Desarrollo de Aplicaciones Multiplataforma)  
**Alumno:** Daniel Daroca  
**Curso:** 2026 - 2027  

---

## 🌐 Enlaces del Proyecto

- 🔗 **Repositorio GitHub:** [https://github.com/danidaroca/ionic-auth-guard](https://github.com/danidaroca/ionic-auth-guard)
- 🚀 **Despliegue en Vercel:** [https://ionic-auth-guard-lime.vercel.app](https://ionic-auth-guard-lime.vercel.app)

---

## 🎯 Alineación Curricular (Comunidad de Madrid)

- **RA 1:** Confecciona interfaces de usuario identificando y aplicando patrones arquitectónicos y optimizando la experiencia de usuario.
  - **CE 1.b:** Se han identificado y aplicado patrones de diseño arquitectónicos adecuados (separación de responsabilidades, MVVM con Angular Signals).
  - **CE 1.c:** Se ha implementado un sistema de enrutamiento modular y navegación estructurada con carga perezosa (*Lazy Loading*).
  - **CE 1.d:** Se han establecido mecanismos de control de acceso y protección de rutas mediante *Functional Guards* (`CanActivateFn`).
  - **CE 1.e:** Se ha gestionado y asegurado la persistencia del estado de autenticación en el cliente utilizando `sessionStorage` (Web Storage API).

---

## 🏗️ Arquitectura Técnica y Enfoque Funcional

En las arquitecturas modernas de Angular (v16+) e Ionic Framework, el sistema de enrutamiento abandonó las interfaces de clases heredadas (`CanActivate`) para dar paso a las **Functional Guards** (`CanActivateFn`).

```
                              [ Petición de Navegación ]
                                          │
                                          ▼
                               [ Angular Router Pipeline ]
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
             [ authGuard: CanActivateFn ]        [ roleGuard: CanActivateFn ]
             • Inyección con inject()            • Factoría parametrizable
             • Consulta reactiva AuthService     • Comprueba role === allowedRole
                        │                                   │
              ¿Sesión válida?                    ¿Rol autorizado?
              /             \                     /             \
            SÍ              NO                  SÍ              NO
            /                 \                 /                 \
      [ Continúa ]      [ Genera UrlTree ] [ Permite acceso ] [ Genera UrlTree ]
                         (a /login con        a la vista       (a /user-dashboard
                         returnUrl)            solicitada       o /login)
```

### Principios Clave Implementados:
1. **Funciones Puras:** Las guardas funcionales (`authGuard` y `roleGuard`) son funciones síncronas/puras que se ejecutan antes de resolver el montaje del componente.
2. **Contexto de Inyección con `inject()`:** Eliminación de constructores y boilerplate de clases; inyección directa de dependencias (`AuthService`, `Router`).
3. **Redirección Atómica con `UrlTree`:** En lugar de retornar `false` y llamar a `router.navigate()`, se retorna `router.createUrlTree(...)`. Esto previene condiciones de carrera, bloquea fugas de memoria y evita el parpadeo en pantalla.
4. **Persistencia y Sincronización:** El estado reactivo de Angular Signals (`signal`, `computed`) se hidrata al arrancar desde `sessionStorage` (`DAM2_AUTH_SESSION`), sobreviviendo recargas de página (F5) pero aislándose por sesión de pestaña.

---

## 👥 Credenciales del Sistema y Roles

El sistema implementa control de acceso granular con dos perfiles de usuario:

| Usuario | Contraseña | Rol asignado | Rutas Autorizadas | Redirección en caso de denegación |
| :--- | :--- | :--- | :--- | :--- |
| **`admin`** | `123` | `'admin'` | `/admin`, `/user-dashboard` | Redirige a `/login` si no autenticado |
| **`operador`** | `123` | `'user'` | `/user-dashboard` | Redirige atómicamente a `/user-dashboard` si intenta entrar a `/admin` |

---

## 📂 Estructura del Código

```text
c:\Users\Daniel\Desktop\DI\Guard\
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts           # Functional Guard para verificar autenticación
│   │   │   │   ├── auth.guard.spec.ts      # Tests unitarios del guard
│   │   │   │   ├── role.guard.ts           # Factoría roleGuard(allowedRole: string)
│   │   │   │   └── role.guard.spec.ts      # Tests unitarios del control RBAC
│   │   │   └── services/
│   │   │       ├── auth.service.ts         # Gestión de sesión con Signals y sessionStorage
│   │   │       └── auth.service.spec.ts    # Tests unitarios de login/logout/persistencia
│   │   ├── pages/
│   │   │   ├── login/                      # Vista de login con selectores rápidos de prueba
│   │   │   ├── admin/                      # Panel exclusivo para rol 'admin'
│   │   │   └── user-dashboard/             # Panel para rol 'user' con prueba de intercepción
│   │   ├── app.component.ts                # Componente raíz Standalone con ion-router-outlet
│   │   └── app.routes.ts                   # Definición de rutas protegidas y Lazy Loading
├── angular.json                            # Configuración del builder y budgets
├── package.json                            # Dependencias de Ionic y Angular
├── vercel.json                             # Enrutamiento SPA y rewrites para Vercel
└── README.md                               # Documentación técnica completa
```

---

## 🧪 Demostración y Verificación Técnica

### 1. Inspección de Persistencia en Developer Tools
1. Iniciar sesión con `admin` / `123`.
2. Abrir DevTools (`F12`) -> Pestaña **Application / Almacenamiento** -> **Session Storage** -> `http://localhost:8100`.
3. Comprobar la creación inmediata de la clave:
   ```json
   {
     "username": "admin",
     "role": "admin",
     "isAuthenticated": true
   }
   ```
4. Refrescar la página (`F5`): el estado en memoria se rehidrata desde el almacenamiento y la sesión no se pierde.

### 2. Prueba de Ataque por Acceso Directo de URL (Usuario no autenticado)
1. Cerrar sesión.
2. Escribir manualmente en la barra de direcciones: `http://localhost:8100/admin`.
3. **Resultado comprobable:** La URL vuelve de inmediato a `/login?returnUrl=%2Fadmin`. El componente `AdminPage` nunca se monta en el DOM.

### 3. Prueba de Intrusión Inter-Rol (Usuario 'operador' accediendo a '/admin')
1. Iniciar sesión como `operador` / `123`.
2. La aplicación redirige a `/user-dashboard`.
3. Escribir manualmente en la barra de direcciones del navegador: `http://localhost:8100/admin` o pulsar el botón de verificación en la interfaz.
4. **Resultado comprobable:** `roleGuard('admin')` intercepta la navegación, deniega el acceso y devuelve un `UrlTree` hacia `/user-dashboard`.

---

## ⚙️ Comandos de Ejecución y Pruebas

```bash
# Instalar dependencias
npm install

# Compilar proyecto para producción
npm run build

# Ejecutar servidor de desarrollo local
ionic serve

# Ejecutar suite de pruebas unitarias automatizadas
npx ng test --configuration=ci
```
