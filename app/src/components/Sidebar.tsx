'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Globe,
  History,
  FileText,
  Settings,
  Beaker,
  Droplets,
  Factory,
  FlaskConical,
  Layers,
  Edit3,
  Network
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Edit Progress', href: '/edit-progress', icon: Edit3 },
  { name: 'Chat Agent', href: '/chat', icon: MessageSquare },
  { name: 'Digital Integration', href: '/digital-integration', icon: Network },
  { name: 'Market Intelligence', href: '/intelligence', icon: Globe },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Strategy History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const segments = [
  { name: 'Onshore', href: '/segments/onshore', icon: Factory },
  { name: 'Offshore', href: '/segments/offshore', icon: Droplets },
  { name: 'Midstream', href: '/segments/midstream', icon: Layers },
  { name: 'Recovery', href: '/segments/recovery', icon: FlaskConical },
  { name: 'Integrated', href: '/segments/integrated', icon: Beaker },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-slb-black text-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slb-blue rounded-lg flex items-center justify-center">
            <Beaker className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-light tracking-wide">SLB</span>
            <span className="text-xs block text-gray-400 font-light">StrategyAI</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <p className="px-3 text-xs font-light text-gray-500 uppercase tracking-wider mb-2">
            Main
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-light rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slb-blue text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div>
          <p className="px-3 text-xs font-light text-gray-500 uppercase tracking-wider mb-2">
            Market Segments
          </p>
          {segments.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-light rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slb-blue text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-gray-800">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2.5 text-sm font-light text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
}
