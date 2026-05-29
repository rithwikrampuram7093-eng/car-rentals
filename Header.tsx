import React from 'react';
import { Car, Landmark, BookmarkCheck, CalendarDays } from 'lucide-react';

/**
 * Header Component
 * This is a standard navigation bar at the top of the webpage.
 * For beginners, this is equivalent to a <header> tag in pure HTML
 * styled with beautiful modern Tailwind CSS classes!
 */
export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
              {/* Lucide icon representing a car */}
              <Car className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">
                WheelFlow <span className="text-blue-600 font-medium text-sm px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 ml-1">Rentals</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Beginner Coding Project</p>
            </div>
          </div>

          {/* Quick Context Guides - Helpful for learning! */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Landmark className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">1st Year Friendly Code Structure</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Real-Time Price Engine</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
              <BookmarkCheck className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Local Storage Persisted</span>
            </div>
          </div>

          {/* Badge indicating system status */}
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Digital Booking System</span>
          </div>

        </div>
      </div>
    </header>
  );
}
