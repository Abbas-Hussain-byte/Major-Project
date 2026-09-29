import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, FileText, BookOpen, Coins, User } from 'lucide-react';
import './Navigation.css'; // We'll create this next

const navItems = [
  { path: '/eligibility', icon: Shield, label: 'Eligibility' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/literacy', icon: BookOpen, label: 'Literacy' },
  { path: '/income', icon: Coins, label: 'Income' },
  { path: '/profile', icon: User, label: 'Profile' }
];

export default function Navigation() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={32} strokeWidth={1.5} className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
