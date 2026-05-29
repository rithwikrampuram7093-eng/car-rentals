/**
 * Car Rental Booking System - Types Definition
 * This file defines the TypeScript interfaces we use throughout the application.
 * It serves as a clear roadmap of how our data structures are designed.
 */

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: 'Economy' | 'Luxury' | 'SUV' | 'Sedan';
  pricePerDay: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number;
  rating: number;
  available: boolean;
  imageColor: string; // Tailwinds color class to paint a mock aesthetic vector card representation
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId: string; // Reference to the selected car
  carName: string; // Denormalized for simple reading
  carBrand: string;
  pricePerDay: number;
  pickupLocation: string;
  dropLocation: string;
  tripType: 'One-Way' | 'Round-Trip';
  pickupDate: string;
  dropDate: string;
  totalDays: number;
  promoCode: string;
  totalCost: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface FilterOptions {
  search: string;
  type: string;
  transmission: string;
  maxPrice: number;
}
