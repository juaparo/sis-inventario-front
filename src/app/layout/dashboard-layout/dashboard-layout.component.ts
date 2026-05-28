import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  Package, 
  RefreshCw, 
  Bell, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Tag, 
  Shield 
} from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  LayoutDashboardIcon = LayoutDashboard;
  PackageIcon = Package;
  RefreshCwIcon = RefreshCw;
  BellIcon = Bell;
  UsersIcon = Users;
  LogOutIcon = LogOut;
  MenuIcon = Menu;
  XIcon = X;
  TagIcon = Tag;
  ShieldIcon = Shield;

  sidebarOpen = true;
  user: any = {};
  isAdmin = false;
  unreadAlerts = 0;
  currentPath = '';
  private alertSub?: Subscription;

  menuItems: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertsService: AlertsService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath = event.urlAfterRedirects;
    });
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : {};
    this.isAdmin = this.user.role === 'Administrador';

    this.menuItems = [];
    
    if (this.authService.hasPermission('dashboard_view')) {
      this.menuItems.push({ icon: this.LayoutDashboardIcon, label: 'Dashboard', path: '/' });
    }
    if (this.authService.hasPermission('products_view')) {
      this.menuItems.push({ icon: this.PackageIcon, label: 'Productos', path: '/products' });
    }
    if (this.authService.hasPermission('categories_view')) {
      this.menuItems.push({ icon: this.TagIcon, label: 'Categorías', path: '/categories' });
    }
    if (this.authService.hasPermission('movements_create')) {
      this.menuItems.push({ icon: this.RefreshCwIcon, label: 'Movimientos', path: '/movements' });
    }
    if (this.authService.hasPermission('alerts_manage')) {
      this.menuItems.push({ icon: this.BellIcon, label: 'Alertas', path: '/alerts', badge: this.unreadAlerts });
    }
    if (this.authService.hasPermission('users_view') || this.authService.hasPermission('users_manage')) {
      this.menuItems.push({ icon: this.UsersIcon, label: 'Usuarios', path: '/users' });
    }
    if (this.authService.hasPermission('roles_view') || this.authService.hasPermission('roles_manage')) {
      this.menuItems.push({ icon: this.ShieldIcon, label: 'Roles', path: '/roles' });
    }
    
    // Set initial path
    this.currentPath = this.router.url;

    // Cargar alertas iniciales
    this.alertsService.getAlerts().subscribe();

    // Suscribirse a cambios en tiempo real
    this.alertSub = this.alertsService.unreadCount$.subscribe(count => {
      this.unreadAlerts = count;
      const alertsMenu = this.menuItems.find(m => m.label === 'Alertas');
      if (alertsMenu) {
        alertsMenu.badge = count;
      }
    });
  }

  ngOnDestroy() {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  isActive(path: string): boolean {
    if (path === '/') {
      return this.currentPath === '/' || this.currentPath === '';
    }
    return this.currentPath.startsWith(path);
  }
}
