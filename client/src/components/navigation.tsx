import { Link, useLocation } from "wouter";
import { Heart, Users, Clock, DollarSign, Briefcase, MapPin, Bell, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Heart },
    { path: "/guests", label: "Guests", icon: Users },
    { path: "/timeline", label: "Timeline", icon: Clock },
    { path: "/budget", label: "Budget", icon: DollarSign },
    { path: "/vendors", label: "Vendors", icon: Briefcase },
    { path: "/seating", label: "Seating", icon: MapPin },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-soft-blush">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Heart className="text-rose-gold text-2xl mr-3" />
            <h1 className="text-2xl font-playfair font-semibold text-gray-800">Dream Day</h1>
          </div>
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} href={path}>
                <a
                  className={`flex items-center space-x-2 text-gray-600 hover:text-rose-gold transition-colors ${
                    location === path ? "text-rose-gold" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </a>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-400 hover:text-rose-gold cursor-pointer" />
            <div className="w-8 h-8 bg-rose-gold rounded-full flex items-center justify-center">
              <User className="text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
