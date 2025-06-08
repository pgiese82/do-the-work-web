
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

const routeLabels: Record<string, string> = {
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'bookings': 'Bookings',
  'calendar': 'Calendar',
  'clients': 'Clients',
  'payments': 'Payments',
  'documents': 'Documents',
  'settings': 'Settings',
};

export function AdminBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length <= 2) {
    return null; // Don't show breadcrumb for root admin pages
  }

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;

    return {
      path,
      label,
      isLast,
    };
  });

  return (
    <div className="px-6 py-4 border-b border-orange-900/20 bg-gray-900/50">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="text-orange-300">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={item.path} 
                      className="text-gray-400 hover:text-orange-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
