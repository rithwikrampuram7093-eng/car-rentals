import React, { useState } from 'react';
import { Booking } from '../types';
import { Search, Calendar, FileText, CheckCircle2, XCircle, Clock, Trash2, Mail, Phone, MapPin, RefreshCw, Layers } from 'lucide-react';

/**
 * Props expected by BookingDashboard
 */
interface BookingDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
}

/**
 * BookingDashboard Component
 * This section acts as the "Digital Manager Backoffice Panel".
 * It lets users search, inspect, approve, and cancel rental reservations.
 * Demonstrates state modification mechanics to introductory developers.
 */
export default function BookingDashboard({ bookings, onUpdateStatus, onDeleteBooking }: BookingDashboardProps) {
  // Local state for searching & filtering through bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | Booking['status']>('All');

  // Search/Filter function logic
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper to color-code reservation status badges
  const getStatusBadgeStyle = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Helper to choose corresponding status icon
  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'Confirmed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Cancelled':
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 bg-white">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Digital Booking Control center
          </h2>
          <p className="text-xs text-slate-400 mt-1">Simulate reservation review pipelines, cancellations, and data deletions</p>
        </div>
        
        {/* Total stats */}
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Bookings Total: {filteredBookings.length}
        </span>
      </div>

      {/* FILTER SEARCH TOOLBAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        
        {/* Search Input bar */}
        <div className="relative col-span-1 lg:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Search Database Records</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="search-bookings-query"
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
              placeholder="Search by ID, Customer Name, or Car model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Status Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Filter by Booking Status</label>
          <select
            id="filter-bookings-status"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending Approvals</option>
            <option value="Confirmed">Confirmed Trips</option>
            <option value="Cancelled">Cancelled Requests</option>
            <option value="Completed">Completed Journeys</option>
          </select>
        </div>

      </div>

      {/* DIGITAL RENTAL LIST */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              id={`booking-row-${booking.id}`}
              className={`p-5 rounded-2xl border transition-all duration-300 bg-white ${
                booking.status === 'Cancelled'
                  ? 'border-slate-100 opacity-60 bg-slate-50/50'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-xs'
              }`}
            >
              {/* Row Header */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                    {booking.id}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Logged: {new Date(booking.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Indicator Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border flex items-center gap-1 uppercase tracking-wide ${getStatusBadgeStyle(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Booking Metadata Core columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Column 1: Customer Info */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Details</h4>
                  <div className="font-bold text-slate-800 text-sm">{booking.customerName}</div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.customerPhone}</span>
                  </div>
                </div>

                {/* Column 2: Route & Dates */}
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dates & Route Type</h4>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold">{booking.pickupDate} → {booking.dropDate}</span>
                    <span className="font-mono font-bold text-blue-600">({booking.totalDays}d)</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Pick: {booking.pickupLocation.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Drop: {booking.dropLocation.split('(')[0]}</span>
                  </div>
                </div>

                {/* Column 3: Pricing and Car Chosen */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Selected</h4>
                    <div className="font-bold text-slate-800 mt-1">{booking.carBrand} {booking.carName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">${booking.pricePerDay} day rate ({booking.tripType})</span>
                  </div>
                  
                  <div className="flex justify-between items-baseline mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Grand Total Cost</span>
                    <span className="text-base font-extrabold font-mono text-emerald-600">${booking.totalCost.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* ACTION TOOLBAR AT THE BOTTOM */}
              <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  PROMO USED: {booking.promoCode ? <span className="font-bold text-blue-600">"{booking.promoCode}"</span> : <span className="italic">None</span>}
                </div>

                <div className="flex gap-2">
                  
                  {/* Status transitions logic: Confirm booking if it is pending */}
                  {booking.status === 'Pending' && (
                    <button
                      id={`btn-approve-booking-${booking.id}`}
                      onClick={() => onUpdateStatus(booking.id, 'Confirmed')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Reservation
                    </button>
                  )}

                  {/* Cancel Booking action */}
                  {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                    <button
                      id={`btn-cancel-booking-${booking.id}`}
                      onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                      className="px-3.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Cancel Trip
                    </button>
                  )}

                  {/* Restoring option to show ease-of-state manipulation */}
                  {booking.status === 'Cancelled' && (
                    <button
                      id={`btn-restore-booking-${booking.id}`}
                      onClick={() => onUpdateStatus(booking.id, 'Pending')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin" /> Restore Request
                    </button>
                  )}

                  {/* Hard Delete Booking to clear dataset */}
                  <button
                    id={`btn-delete-booking-${booking.id}`}
                    onClick={() => onDeleteBooking(booking.id)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                    title="Exterminate Booking Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-600">No Booking Records Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">None of our database matches your query. Try selection adjusting the filters or register a new request above!</p>
        </div>
      )}

    </div>
  );
}
