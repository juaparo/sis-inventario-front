import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
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
  unreadAlerts = 3;
  currentPath = '';

  menuItems: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
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

    this.menuItems = [
      { icon: this.LayoutDashboardIcon, label: 'Dashboard', path: '/' },
      { icon: this.PackageIcon, label: 'Productos', path: '/products' },
      { icon: this.TagIcon, label: 'Categorías', path: '/categories' },
      { icon: this.RefreshCwIcon, label: 'Movimientos', path: '/movements' },
      { icon: this.BellIcon, label: 'Alertas', path: '/alerts', badge: this.unreadAlerts }
    ];

    if (this.isAdmin) {
      this.menuItems.push(
        { icon: this.UsersIcon, label: 'Usuarios', path: '/users' },
        { icon: this.ShieldIcon, label: 'Roles', path: '/roles' }
      );
    }
    
    // Set initial path
    this.currentPath = this.router.url;
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
