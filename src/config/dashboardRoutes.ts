
export interface DashboardRoute {
  path: string;
  title: string;
  icon: string;
  component: string;
  showInNav: boolean;
}

export const dashboardRoutes: DashboardRoute[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    component: 'DashboardOverview',
    showInNav: true
  },
  {
    path: '/dashboard/book',
    title: 'Sessie Boeken',
    icon: 'Calendar',
    component: 'BookSession',
    showInNav: true
  },
  {
    path: '/dashboard/bookings',
    title: 'Mijn Boekingen',
    icon: 'CalendarCheck',
    component: 'BookingsOverview',
    showInNav: true
  },
  {
    path: '/dashboard/documents',
    title: 'Documenten',
    icon: 'FileText',
    component: 'Documents',
    showInNav: true
  },
  {
    path: '/dashboard/profile',
    title: 'Profiel',
    icon: 'Settings',
    component: 'ProfileSettings',
    showInNav: true
  }
];

export const getRouteByPath = (path: string) => {
  return dashboardRoutes.find(route => route.path === path);
};
