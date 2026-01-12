'use client';

import Link from 'next/link';
import { MessageSquare, FileText, Globe, BarChart3 } from 'lucide-react';

const actions = [
  {
    name: 'Ask Strategy Agent',
    description: 'Get insights about your strategy',
    href: '/chat',
    icon: MessageSquare,
    color: 'bg-slb-blue',
  },
  {
    name: 'Market Intelligence',
    description: 'View latest market trends',
    href: '/intelligence',
    icon: Globe,
    color: 'bg-green-600',
  },
  {
    name: 'Generate Report',
    description: 'Create executive summary',
    href: '/reports',
    icon: FileText,
    color: 'bg-purple-600',
  },
  {
    name: 'View Analytics',
    description: 'Deep dive into metrics',
    href: '/analytics',
    icon: BarChart3,
    color: 'bg-orange-600',
  },
];

export function QuickActions() {
  return (
    <div className="card">
      <h2 className="text-lg font-light text-slb-black mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex flex-col items-center p-3 rounded-lg border border-gray-100 hover:border-slb-blue hover:shadow-sm transition-all text-center"
          >
            <div
              className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2`}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-light text-gray-900">{action.name}</p>
            <p className="text-xs font-light text-gray-500 mt-0.5">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
