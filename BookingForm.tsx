import React, { useState, useEffect } from 'react';
import { Car, Booking } from '../types';
import { RENTAL_LOCATIONS, PROMO_CODES } from '../data';
import { Calendar, MapPin, Tag, Smartphone, User, Mail, DollarSign, Calculator, Info, Gift } from 'lucide-react';

/**
 * Props expected by BookingForm
 */
interface BookingFormProps {
  selectedCar: Car | null;
  onSubmitBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

/**
 * BookingForm Component
 * Fully functional business form. Manages input states, executes live price
 * logic, computes date diffs, matches active promo codes, and fires submittals.
 */
export default function BookingForm({ selectedCar, onSubmitBooking }: BookingFormProps) {
  // 1. Initial form state fields
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [pickupLocation, setPickupLocation] = useState(RENTAL_LOCATIONS[0]);
  const [dropLocation, setDropLocation] = useState(RENTAL_LOCATIONS[0]);
  const [tripType, setTripType] = useState<'One-Way' | 'Round-Trip'>('Round-Trip');
  
  // Set default dates: Today & Tomorrow
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3); // Default 3 days trip
  const defaultDropStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [dropDate, setDropDate] = useState(defaultDropStr);
  
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [currentDiscount, setCurrentDiscount] = useState<{ type: 'percent' | 'flat'; value: number } | null>(null);

  // Error feedback states
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successCelebration, setSuccessCelebration] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // 2. LIVE CALCULATIONS
  // Calculate total rental days
  const calculateDays = (): number => {
    const start = new Date(pickupDate);
    const end = new Date(dropDate);
    
    // Safety check check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Business rule: Minimal rent term is 1 day
    return diffDays <= 0 ? 1 : diffDays;
  };

  const totalDays = calculateDays();

  // Validate dates: warning if drop is before pickup
  const isDateRangeInvalid = new Date(dropDate) < new Date(pickupDate);

  // Hook to watch promo code input and apply automatically on valid match
  useEffect(() => {
    const codeClean = promoCode.trim().toUpperCase();
    if (codeClean === '') {
      setPromoMessage(null);
      setCurrentDiscount(null);
      return;
    }

    const matched = PROMO_CODES[codeClean];
    if (matched) {
      setCurrentDiscount({ type: matched.discountType, value: matched.value });
      setPromoMessage({
        text: `Success! Code Applied: ${matched.discountType === 'percent' ? `${matched.value}% Off Entire Trip` : `$${matched.value} Flat Off`}`,
        isError: false,
      });
    } else {
      setCurrentDiscount(null);
      setPromoMessage({
        text: 'Invalid or Expired promo code',
        isError: true,
      });
    }
  }, [promoCode]);

  // Price calculations
  const priceRate = selectedCar ? selectedCar.pricePerDay : 0;
  const rawSubtotal = priceRate * totalDays;
  
  // Trip Discount logic: e.g. Automatically cut 10% off for "Round-Trip" to show advanced business rules
  const isRoundTripDiscount = tripType === 'Round-Trip';
  const roundTripDiscountAmount = isRoundTripDiscount ? Number((rawSubtotal * 0.10).toFixed(2)) : 0;
  
  // Promo code discount values
  let promoDiscountAmount = 0;
  if (currentDiscount) {
    if (currentDiscount.type === 'percent') {
      promoDiscountAmount = Number(((rawSubtotal - roundTripDiscountAmount) * (currentDiscount.value / 100)).toFixed(2));
    } else {
      promoDiscountAmount = Math.min(currentDiscount.value, rawSubtotal - roundTripDiscountAmount);
    }
  }

  const grandTotalCost = Math.max(0, rawSubtotal - roundTripDiscountAmount - promoDiscountAmount);

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    // Validation checks for beginner to learn robust form handling
    if (!selectedCar) {
      errors.push('Please select a rental vehicle from the fleet catalog.');
    }
    if (!customerName.trim()) {
      errors.push('Full Name is required.');
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errors.push('A valid email address is required.');
    }
    if (!customerPhone.trim()) {
      errors.push('Phone number is required.');
    }
    if (isDateRangeInvalid) {
      errors.push('The Drop-off date cannot be earlier than your Pickup date.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      setSuccessCelebration(false);
      
      // Auto scroll to errors
      const errorBox = document.getElementById('error-display-banner');
      if (errorBox) {
        errorBox.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // No errors! Prepare submit schema
    setFormErrors([]);
    
    // Fire callback
    onSubmitBooking({
      customerName,
      customerEmail,
      customerPhone,
      carId: selectedCar!.id,
      carName: selectedCar!.name,
      carBrand: selectedCar!.brand,
      pricePerDay: selectedCar!.pricePerDay,
      pickupLocation,
      dropLocation,
      tripType,
      pickupDate,
      dropDate,
      totalDays,
      promoCode: promoCode.trim().toUpperCase(),
      totalCost: grandTotalCost
    });

    // Generate simulated billing reference
    const randomRef = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    setSubmittedId(randomRef);
    setSuccessCelebration(true);

    // Clear form inputs
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setPromoCode('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-20">
      
      <div className="border-b border-slate-100 pb-4 mb-5">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Rental Reservation Request
        </h2>
        <p className="text-xs text-slate-400 mt-1">Fill this form to lock in your instant digital booking request</p>
      </div>

      {/* Success View Banner */}
      {successCelebration && (
        <div id="booking-success-alert" className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-5 text-emerald-800 text-xs animate-fadeIn shadow-xs">
          <h4 className="font-bold text-sm mb-1 text-emerald-900 flex items-center gap-1.5ClassName">
            🎉 Booking Request Submitted!
          </h4>
          <p className="mb-2 text-emerald-700">
            Thank you! Your booking has been logged. Our dispatcher will review your request.
          </p>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-100 font-mono text-center font-bold text-emerald-950 inline-block">
            REF CODE: {submittedId}
          </div>
          <button
            id="btn-close-success"
            type="button"
            onClick={() => setSuccessCelebration(false)}
            className="block mt-2.5 text-emerald-900 hover:underline font-semibold cursor-pointer"
          >
            Create Another Reservation
          </button>
        </div>
      )}

      {/* Form Error Alert */}
      {formErrors.length > 0 && (
        <div id="error-display-banner" className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-5 text-rose-800 text-xs animate-pulse">
          <h4 className="font-bold mb-1.5 text-rose-900">Missing Required Fields:</h4>
          <ul className="list-disc pl-4 space-y-1 text-rose-700">
            {formErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* RENTAL FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* SECTION A: TRIP SELECTION DETAIL */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Step 1: Select Locations & Dates
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Trip Type Buttons - Radio Choice Demonstration */}
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Trip Scheme</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="btn-triptype-oneway"
                  onClick={() => setTripType('One-Way')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center transition-colors ${
                    tripType === 'One-Way'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  One-Way Drive
                </button>
                <button
                  type="button"
                  id="btn-triptype-round"
                  onClick={() => setTripType('Round-Trip')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer text-center transition-colors relative ${
                    tripType === 'Round-Trip'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Round-Trip (10% Off)
                  <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                </button>
              </div>
            </div>

            {/* Pickup Location Dropdown */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Pickup Location
              </label>
              <select
                id="pickup-location-select"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              >
                {RENTAL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Drop locations dropdown */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Drop Location
              </label>
              <select
                id="drop-location-select"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
                disabled={tripType === 'Round-Trip'} // If round trip, drop is same as pickup
                value={tripType === 'Round-Trip' ? pickupLocation : dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
              >
                {tripType === 'Round-Trip' ? (
                  <option value={pickupLocation}>{pickupLocation} (Locked for Round-Trip)</option>
                ) : (
                  RENTAL_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))
                )}
              </select>
            </div>

            {/* Dates range inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Pickup Date
                </label>
                <input
                  id="pickup-date-input"
                  type="date"
                  min={todayStr}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Drop Date
                </label>
                <input
                  id="drop-date-input"
                  type="date"
                  min={pickupDate}
                  className={`w-full bg-white border rounded-xl px-2.5 py-1.5 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors ${
                    isDateRangeInvalid ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                  value={dropDate}
                  onChange={(e) => setDropDate(e.target.value)}
                />
              </div>
            </div>

            {isDateRangeInvalid && (
              <p className="text-[10px] text-rose-500 font-medium">
                ⚠️ Warning: Drop-off date must be after pickup!
              </p>
            )}

            {/* Total calculated days tag */}
            <div className="bg-slate-100 p-2 rounded-lg text-center text-xs font-mono font-bold text-slate-600 flex justify-between items-center px-3">
              <span>Total Rental Duration:</span>
              <span className="text-blue-600">{totalDays} {totalDays === 1 ? 'Day' : 'Days'}</span>
            </div>

          </div>
        </div>

        {/* ACTIVE VECHICLE PREVIEW CARD */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Step 2: Selected Vehicle
          </h3>

          {selectedCar ? (
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${selectedCar.imageColor} flex items-center justify-center text-xl`}>
                🚙
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">{selectedCar.brand}</span>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">{selectedCar.name}</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">${selectedCar.pricePerDay}/day • {selectedCar.transmission}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-medium">Daily Cost</span>
                <span className="text-xs font-extrabold font-mono text-slate-800">${selectedCar.pricePerDay}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs text-center font-medium">
              🚨 No Car Selected!
              <p className="text-[11px] text-amber-700 font-normal mt-1">Please select an available vehicle from the fleet list on the right first.</p>
            </div>
          )}
        </div>

        {/* SECTION B: CUSTOMER IDENTITY */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Step 3: Contact Information
          </h3>

          {/* Customer Name */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name
            </label>
            <input
              id="customer-name-input"
              type="text"
              placeholder="e.g. John Doe"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Email Address */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                id="customer-email-input"
                type="email"
                placeholder="john@example.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
            </div>

            {/* Mobile Contact */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                Phone Number
              </label>
              <input
                id="customer-phone-input"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-hidden focus:border-blue-500 transition-colors"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION C: VALIDATE DISCOUNT PROMO */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center mb-1 bg-slate-50">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Promo Code
            </label>
            <span className="text-[10px] text-blue-500 font-mono font-bold flex items-center gap-0.5">
              <Gift className="w-3 h-3" /> Try: WELCOME10, ROADTRIP20
            </span>
          </div>
          <input
            id="promo-code-input"
            type="text"
            placeholder="e.g. WELCOME10"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-blue-500 uppercase tracking-widest transition-colors"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />

          {promoMessage && (
            <p className={`text-[10px] font-medium mt-1.5 leading-none ${
              promoMessage.isError ? 'text-rose-500' : 'text-emerald-600'
            }`}>
              {promoMessage.text}
            </p>
          )}
        </div>

        {/* BOTTOM METRIC SUMMARY INVOICE BOX */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl space-y-2 font-sans relative overflow-hidden">
          {/* Aesthetic background design decoration */}
          <div className="absolute top-0 right-0 p-4 text-slate-800 pointer-events-none select-none text-7xl font-black font-mono">
            $
          </div>

          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-800">
            Fare Summary Preview
          </h4>

          {/* Subtotal Days calculation */}
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Base Rental ({totalDays} {totalDays === 1 ? 'day' : 'days'})</span>
            <span className="font-mono">${rawSubtotal.toFixed(2)}</span>
          </div>

          {/* Round Trip Automatic Deduction */}
          {isRoundTripDiscount && (
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Round-Trip Incentive (10% Off)</span>
              <span className="font-mono">-${roundTripDiscountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Applied promo percentage/flat discount */}
          {currentDiscount && (
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Promo Code Discount Applied</span>
              <span className="font-mono">-${promoDiscountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-800 text-white">
            <span className="flex items-center gap-1">Grand Price Invoice</span>
            <span className="font-mono text-lg text-emerald-400">${grandTotalCost.toFixed(2)}</span>
          </div>
          
          <p className="text-[10px] text-slate-400 text-center italic pt-1">
            *No credit card needed today. Pay during pickup!
          </p>
        </div>

        {/* Booking Request Action Submission Button */}
        <button
          type="submit"
          id="btn-submit-booking-form"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all hover:shadow-lg flex items-center justify-center gap-2"
        >
          <DollarSign className="w-4 h-4" />
          Request Booking Lock-In
        </button>

      </form>

    </div>
  );
}
