
export interface AdminRoute {
  path: string;
  title: string;
  icon: string;
  component: string;
  showInNav: boolean;
  group?: string;
}

export const adminRoutes: AdminRoute[] = [
  {
    path: '/admin/dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    component: 'AdminDashboard',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/bookings',
    title: 'Boekingen',
    icon: 'CalendarCheck',
    component: 'AdminBookings',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/calendar',
    title: 'Kalender',
    icon: 'Calendar',
    component: 'AdminCalendar',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/clients',
    title: 'Klanten',
    icon: 'Users',
    component: 'AdminClients',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/payments',
    title: 'Betalingen',
    icon: 'CreditCard',
    component: 'AdminPayments',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/documents',
    title: 'Documenten',
    icon: 'FileText',
    component: 'AdminDocuments',
    showInNav: true,
    group: 'main'
  },
  {
    path: '/admin/notifications',
    title: 'Meldingen',
    icon: 'Bell',
    component: 'AdminNotifications',
    showInNav: true,
    group: 'secondary'
  },
  {
    path: '/admin/cms',
    title: 'Website Beheer',
    icon: 'Globe',
    component: 'AdminCMS',
    showInNav: true,
    group: 'secondary'
  },
  {
    path: '/admin/audit',
    title: 'Activiteitenlog',
    icon: 'Activity',
    component: 'AdminAuditLogs',
    showInNav: true,
    group: 'secondary'
  },
  {
    path: '/admin/settings',
    title: 'Instellingen',
    icon: 'Settings',
    component: 'AdminSettings',
    showInNav: true,
    group: 'secondary'
  }
];

export const getAdminRouteByPath = (path: string) => {
  return adminRoutes.find(route => route.path === path);
};

export const getMainAdminRoutes = () => {
  return adminRoutes.filter(route => route.group === 'main' && route.showInNav);
};

export const getSecondaryAdminRoutes = () => {
  return adminRoutes.filter(route => route.group === 'secondary' && route.showInNav);
};
