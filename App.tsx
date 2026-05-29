import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import CarCatalog from './components/CarCatalog';
import BookingForm from './components/BookingForm';
import BookingDashboard from './components/BookingDashboard';

import { Car, Booking } from './types';
import { AVAILABLE_CARS, INITIAL_BOOKINGS } from './data';
import { BookOpen, HelpCircle, Terminal, CheckCircle, Database, ToggleLeft, ToggleRight, LayoutDashboard, Compass } from 'lucide-react';

/**
 * Main App Component
 * This acts as the root coordinates of our Car Rental Booking System.
 * We include extensive comments so a 1st-year student or beginner can
 * effortlessly understand how React hooks map back to HTML and pure JS.
 */
export default function App() {
  // State 1: Current selected car (which highlights in catalog and fills into form)
  const [selectedCar, setSelectedCar] = useState<Car | null>(AVAILABLE_CARS[0]);

  // State 2: Active dashboard view mode tab
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // State 3: Storage array of all booking reservations (Persisted with LocalStorage!)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // 💡 Beginner Concept: LocalStorage lets us save variables inside the browser so it doesn't reset on refresh
    const saved = localStorage.getItem('wheelFlow_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to restore bookings state', e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  // State 4: Interactive toggler for learning overlay companion
  const [showLearningCompanion, setShowLearningCompanion] = useState(true);

  // Synchronize bookings array with localStorage on every change
  useEffect(() => {
    localStorage.setItem('wheelFlow_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handle vehicle select trigger
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
    // Smooth scroll the user to the form on mobile
    const formElement = document.getElementById('booking-success-alert') || document.getElementById('pickup-location-select');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Callback to insert a new rental reservation booking request
  const handleAddNewBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    // Generate a fresh unique random ID
    const randomId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    
    const preparedBooking: Booking = {
      ...newBookingData,
      id: randomId,
      status: 'Pending', // All new orders default to pending review
      createdAt: new Date().toISOString(),
    };

    // Prepend the new booking into our list (newest first)
    setBookings(prev => [preparedBooking, ...prev]);
  };

  // Callback to modify booking statuses (Confirm approval, or cancel trips)
  const handleUpdateStatus = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  // Callback to hard delete a booking record from the client-side system
  const handleDeleteBooking = (bookingId: string) => {
    if (window.confirm(`Are you sure you want to permanently erase booking reference draft ${bookingId}?`)) {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Visual Navigation Banner */}
      <Header />

      {/* Main Container Workspace wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* STUDY COMPANION BANNER FOR BEGINNERS */}
        {showLearningCompanion && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-slate-100 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 bg-indigo-800/20 w-44 h-44 rounded-full blur-2xl"></div>
            <div className="absolute -right-2 top-2 text-6xl opacity-10 select-none">🎓</div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center relative z-10">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-sm">
                    Class Project
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    🎓 1st Year Coding Student Companion Mode
                  </h3>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed font-sans">
                  This application was coded deliberately to showcase how advanced full-stack concepts like real-time mathematics, state-driven search filtering, form validations, and status approvals are constructed cleanly in modern React (built with simplified HTML tags, standard JavaScript logic, and Tailwind classes!).
                </p>
              </div>

              <div className="flex gap-2.5 shrink-0">
                <a 
                  href="#student-curriculum-anchor" 
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-xs font-bold border border-indigo-700 transition-colors"
                >
                  View Code Guide ↓
                </a>
                <button
                  id="btn-hide-curriculum"
                  onClick={() => setShowLearningCompanion(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/20 text-xs font-bold transition-all"
                >
                  Got it, Hide Header
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY SYSTEM SELECTION TAB CONTROLLER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-xs">
          
          {/* Title block */}
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-[10px] text-slate-400 font-mono block leading-none">CORE BUSINESS PORTAL</span>
              <h2 className="text-sm font-bold text-slate-800">Select Interactive Operations Mode</h2>
            </div>
          </div>

          {/* Sliding Toggles with Icons */}
          <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border border-slate-150 w-full sm:w-auto">
            
            {/* Tab: Customer terminal */}
            <button
              id="tab-select-customer"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              1. Customer Booking Terminal
            </button>

            {/* Tab: Administration Dashboard */}
            <button
              id="tab-select-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              2. Admin Dispatch Desk
              {bookings.filter(b=>b.status==='Pending').length > 0 && (
                <span className="absolute -top-1 right-0 rounded-full bg-amber-500 text-[9px] text-white font-mono px-1.5 py-0.5 shadow-sm font-bold animate-pulse">
                  {bookings.filter(b=>b.status==='Pending').length} Pending
                </span>
              )}
            </button>

          </div>

        </div>

        {/* TAB WORKSPACE ROUTER */}
        {activeTab === 'customer' ? (
          /* WORKSPACE VIEW 1: CUSTOMER BOOKING FLOW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column A (Left): Core Booking Request form - spans 5 columns on large screen */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <BookingForm 
                selectedCar={selectedCar} 
                onSubmitBooking={handleAddNewBooking} 
              />
            </div>

            {/* Column B (Right): Dynamic Interactive Fleet Finder - spans 7 columns */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              {/* Feature Tip */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                <p>
                  <strong>Tip for Customers:</strong> Click any of the vehicle option cards below to instantly load its pricing details into your reservation form on the left! Try changing the trip schemes to watch the live discounts update.
                </p>
              </div>

              <CarCatalog
                cars={AVAILABLE_CARS}
                selectedCarId={selectedCar ? selectedCar.id : ''}
                onSelectCar={handleSelectCar}
              />
            </div>

          </div>
        ) : (
          /* WORKSPACE VIEW 2: ADMINISTRATION BOOKINGS TRACKER */
          <div className="space-y-6">
            
            {/* KPI Metrics Dashboard Counters */}
            <StatsGrid bookings={bookings} cars={AVAILABLE_CARS} />

            {/* Main Interactive Booking Log Table */}
            <BookingDashboard 
              bookings={bookings} 
              onUpdateStatus={handleUpdateStatus} 
              onDeleteBooking={handleDeleteBooking}
            />

          </div>
        )}

        {/* DEDICATED STUDENT LEARNING GUIDE ACCORDION - CORE REQUIREMENT INTEGRATION CARD */}
        <section 
          id="student-curriculum-anchor" 
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">
              🎓 1st Year Coding Guide: Bridging React back to HTML, CSS, & Javascript
            </h3>
          </div>

          <div className="text-slate-600 leading-relaxed space-y-4 text-xs">
            <p>
              Many beginner courses start with separate <code>index.html</code>, <code>style.css</code>, and <code>script.js</code> files. In modern industry, developers use <strong>React</strong> and <strong>Tailwind CSS</strong> to build these systems more easily and reliably. Here is an easy mapping index to translate what you see here to basic web concepts:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans mt-3">
              
              {/* Box A: HTML Translation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>The HTML Aspect</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instead of standard separate <code>.html</code> documents, React uses <strong>JSX code syntax</strong>. Inside our codebase, tags like <code>&lt;div&gt;</code>, <code>&lt;select&gt;</code>, and <code>&lt;button&gt;</code> behave exactly like pure HTML tags, allowing us to compose modular visual trees!
                </p>
                <div className="font-mono text-[10px] bg-white p-1.5 rounded-sm border border-slate-200">
                  {`// Written as JSX in React\n<button id="cta">\n  Request Booking\n</button>`}
                </div>
              </div>

              {/* Box B: CSS Translation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span className="text-xs">🎨</span>
                  <span>The Style CSS Aspect</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instead of writing redundant key-value parameters inside custom files, we use <strong>Tailwind CSS classes</strong>. For example: <code>bg-blue-600</code> equates to <code>background-color: #2563eb;</code>, and <code>rounded-2xl</code> equates to a border-radius of <code>1rem;</code>.
                </p>
                <div className="font-mono text-[10px] bg-white p-1.5 rounded-sm border border-slate-200">
                  {`/* Equivalent pure CSS css */\n#card {\n  padding: 1.25rem;\n  border-radius: 1rem;\n}`}
                </div>
              </div>

              {/* Box C: JS Translation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>The JavaScript Logic</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  We use standard JavaScript date math algorithms! For example, subtracting standard timestamp numbers: <code>(dt2 - dt1) / 86400000</code> computes the precise days count, while array mapping dynamically generates the rows list on the fly.
                </p>
                <div className="font-mono text-[10px] bg-white p-1.5 rounded-sm border border-slate-200">
                  {`// Standard Math calculation\nconst diffInDays = Math.ceil(\n  (dropDate - pickupDate) / \n  (1000 * 60 * 60 * 24)\n);`}
                </div>
              </div>

            </div>

            <div className="bg-indigo-50 border border-indigo-150 p-3.5 rounded-xl mt-4 text-[11px] text-indigo-950 flex gap-2">
              <span className="text-base">💡</span>
              <p className="leading-normal">
                <strong>Why this is awesome to learn:</strong> Notice how when you type inside the Name input field or change the calendars, the total price instantly updates down in the sum box! In standard HTML/JS, you would have had to write many manual lines of <code>document.getElementById().innerText = ...</code> to update elements. React does this for you automatically of state-driven updates!
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER METADATA MARKER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-slate-400 text-center text-xs">
        <p className="font-semibold text-slate-500">WheelFlow Digital Car Rentals - 1st Year Academic Project Prototype</p>
        <p className="mt-1 font-mono text-[10px]">Client-Side React SPA Core Engine • Compiled Successfully</p>
      </footer>

    </div>
  );
}
