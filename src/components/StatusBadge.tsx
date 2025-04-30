
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'in transit':
        return 'status-badge-transit';
      case 'pickup':
        return 'status-badge-pickup';
      case 'confirmed':
        return 'status-badge-confirmed';
      case 'new':
        return 'status-badge-new';
      case 'contacted':
        return 'status-badge-contacted';
      case 'qualified':
        return 'status-badge-qualified';
      case 'converted':
        return 'status-badge-converted';
      default:
        return 'bg-status-secondary';
    }
  };

  return (
    <span className={cn('status-badge', getStatusClass(), className)}>
      {status}
    </span>
  );
};

export default StatusBadge;
