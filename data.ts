/**
 * Car Rental Booking System - Static Data
 * This file contains mock data representing our car inventory, office locations, and initial rental bookings.
 * Keeping this separate from our UI code is a great business practice that makes code clean and easy to read.
 */

import { Car, Booking } from './types';

// List of available rental vehicles with specific properties
export const AVAILABLE_CARS: Car[] = [
  {
    id: 'car-1',
    name: 'Model Y',
    brand: 'Tesla',
    type: 'Luxury',
    pricePerDay: 89,
    transmission: 'Automatic',
    fuelType: 'Electric',
    seats: 5,
    rating: 4.9,
    available: true,
    imageColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'car-2',
    name: 'Civic Hatchback',
    brand: 'Honda',
    type: 'Economy',
    pricePerDay: 39,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    rating: 4.7,
    available: true,
    imageColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'car-3',
    name: 'Explorer SUV',
    brand: 'Ford',
    type: 'SUV',
    pricePerDay: 75,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seats: 7,
    rating: 4.6,
    available: true,
    imageColor: 'from-orange-400 to-amber-600',
  },
  {
    id: 'car-4',
    name: '5 Series Sedan',
    brand: 'BMW',
    type: 'Luxury',
    pricePerDay: 110,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    rating: 4.9,
    available: true,
    imageColor: 'from-indigo-500 to-violet-700',
  },
  {
    id: 'car-5',
    name: 'Corolla Classic',
    brand: 'Toyota',
    type: 'Economy',
    pricePerDay: 35,
    transmission: 'Manual',
    fuelType: 'Hybrid',
    seats: 5,
    rating: 4.8,
    available: true,
    imageColor: 'from-sky-400 to-blue-600',
  },
  {
    id: 'car-6',
    name: 'Wrangler Rubicon',
    brand: 'Jeep',
    type: 'SUV',
    pricePerDay: 85,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 5,
    rating: 4.8,
    available: true,
    imageColor: 'from-rose-500 to-red-600',
  }
];

// Physical rental locations where users can pick up/drop off vehicles
export const RENTAL_LOCATIONS: string[] = [
  'JFK International Airport (New York)',
  'LAX Airport Hub (Los Angeles)',
  'SFO Terminal 3 (San Francisco)',
  'Downtown Headquarters (Chicago)',
  'Sarasota Coastal Resort (Florida)',
  'Central Railway Station Loop (Boston)',
];

// Simple active discount codes & their values
export const PROMO_CODES: Record<string, { discountType: 'percent' | 'flat', value: number }> = {
  'WELCOME10': { discountType: 'percent', value: 10 }, // 10% off
  'ROADTRIP20': { discountType: 'flat', value: 20 }, // $20 off
  'FALCON7': { discountType: 'percent', value: 7 }, // 7% off
};

// Initial pre-filled bookings in the system to showcase management capabilities
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1082',
    customerName: 'Alex Mercer',
    customerEmail: 'alex@example.com',
    customerPhone: '+1 (555) 234-5678',
    carId: 'car-1',
    carName: 'Model Y',
    carBrand: 'Tesla',
    pricePerDay: 89,
    pickupLocation: 'JFK International Airport (New York)',
    dropLocation: 'JFK International Airport (New York)',
    tripType: 'Round-Trip',
    pickupDate: '2026-06-10',
    dropDate: '2026-06-15',
    totalDays: 5,
    promoCode: 'WELCOME10',
    totalCost: 400.5, // (89 * 5) - 44.5 (10% off)
    status: 'Confirmed',
    createdAt: '2026-05-28T14:30:00Z',
  },
  {
    id: 'BK-0925',
    customerName: 'Sophia Lin',
    customerEmail: 'sophia@example.com',
    customerPhone: '+1 (555) 987-6543',
    carId: 'car-3',
    carName: 'Explorer SUV',
    carBrand: 'Ford',
    pricePerDay: 75,
    pickupLocation: 'LAX Airport Hub (Los Angeles)',
    dropLocation: 'SFO Terminal 3 (San Francisco)',
    tripType: 'One-Way',
    pickupDate: '2026-06-18',
    dropDate: '2026-06-20',
    totalDays: 2,
    promoCode: '',
    totalCost: 150.0,
    status: 'Pending',
    createdAt: '2026-05-29T08:12:00Z',
  }
];
