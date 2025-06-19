import React from 'react'
import { StatCard } from '@/components/composite/StatCard'
import { classNames } from '@/classNames'
import { Users, Activity, Shield, AlertTriangle } from 'lucide-react'

export const UserQuickStats: React.FC = () => {
  const stats = [
    { 
      title: 'Total Users', 
      value: '24,847', 
      subtitle: '+12% vs last week',
      icon: <Users className="w-6 h-6 text-white" />, 
      color: 'blue' as const 
    },
    { 
      title: 'Active Today', 
      value: '8,934', 
      subtitle: '+5% vs yesterday',
      icon: <Activity className="w-6 h-6 text-white" />, 
      color: 'green' as const 
    },
    { 
      title: 'Pending KYC', 
      value: '247', 
      subtitle: '-8% vs last week',
      icon: <Shield className="w-6 h-6 text-white" />, 
      color: 'amber' as const 
    },
    { 
      title: 'Flagged', 
      value: '18', 
      subtitle: '+2 new alerts',
      icon: <AlertTriangle className="w-6 h-6 text-white" />, 
      color: 'red' as const 
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          {...stat}
          onClick={() => console.log(`Navigate to ${stat.title}`)}
        />
      ))}
    </div>
  )
}
