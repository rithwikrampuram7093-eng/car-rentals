import React, { useState } from 'react';
import { Car, FilterOptions } from '../types';
import { Search, Gauge, Disc, Users, Star, CarFront, Filter } from 'lucide-react';

/**
 * Props expected by CarCatalog
 */
interface CarCatalogProps {
  cars: Car[];
  selectedCarId: string;
  onSelectCar: (car: Car) => void;
}

/**
 * CarCatalog Component
 * Shows list of cars along with filters (Search, Type, Transmission, Max budget price).
 * Perfect demonstration of state-driven filters that beginners can read and understand!
 */
export default function CarCatalog({ cars, selectedCarId, onSelectCar }: CarCatalogProps) {
  // Let's hold our filters in a single modern state object
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: 'All', // 'All', 'Economy', 'Luxury', 'SUV', 'Sedan'
    transmission: 'All', // 'All', 'Automatic', 'Manual'
    maxPrice: 150, // Max price range slider state
  });

  // Handler to safely update subfields of our filters state
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper dictionary mapping car category names to nice emoji icons
  const getCarEmoji = (name: string) => {
    if (name.includes('Model Y') || name.includes('BMW')) return '⚡🏎️';
    if (name.includes('Wrangler')) return '🏔️🛞';
    if (name.includes('Explorer')) return '🏕️🚙';
    return '🚗💨'; // Default standard hatchback
  };

  // Filter our list of cars based on current user inputs
  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.name.toLowerCase().includes(filters.search.toLowerCase()) || 
      car.brand.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type === 'All' || car.type === filters.type;
    
    const matchesTransmission = 
      filters.transmission === 'All' || car.transmission === filters.transmission;
    
    const matchesPrice = car.pricePerDay <= filters.maxPrice;

    return matchesSearch && matchesType && matchesTransmission && matchesPrice;
  });

  // Unique categories for our quick filter tabs
  const carCategories = ['All', 'Economy', 'Luxury', 'SUV', 'Sedan'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CarFront className="w-5 h-5 text-blue-600" />
            Browse Available Vehicle Fleet
          </h2>
          <p className="text-xs text-slate-400 mt-1">Select a car to instantly calculate rental pricing</p>
        </div>
        
        {/* Total indicator */}
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          Showing {filteredCars.length} / {cars.length} vehicles
        </span>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Search bar input */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Search model or brand</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="car-search-input"
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
              placeholder="e.g. Tesla, Honda..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Transmission select */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Transmission Mode</label>
          <select
            id="car-transmission-select"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white transition-colors"
            value={filters.transmission}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
          >
            <option value="All">All Mechanisms</option>
            <option value="Automatic">Automatic Transmission</option>
            <option value="Manual">Manual Stick Shift</option>
          </select>
        </div>

        {/* Max Budget Price Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Max Rent per Day</label>
            <span className="text-xs font-mono font-bold text-blue-600">${filters.maxPrice}/day</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-400 font-bold">$30</span>
            <input
              id="car-price-slider"
              type="range"
              min="30"
              max="150"
              step="5"
              className="w-full tracking-wide accent-blue-600"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400 font-bold">$150</span>
          </div>
        </div>

      </div>

      {/* QUICK CATEGORY TABS (Toggles Type Filter) */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-50 p-1 rounded-xl border border-slate-100">
        {carCategories.map((cat) => (
          <button
            key={cat}
            id={`filter-tab-${cat}`}
            onClick={() => handleFilterChange('type', cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filters.type === cat
                ? 'bg-white text-blue-600 shadow-xs border border-slate-200 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {cat}s
          </button>
        ))}
      </div>

      {/* RENDER FLEET CARDS IN GRID */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCars.map((car) => {
            const isCurrentlySelected = selectedCarId === car.id;

            return (
              <div
                key={car.id}
                id={`car-card-${car.id}`}
                onClick={() => onSelectCar(car)}
                className={`relative rounded-2xl border p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isCurrentlySelected
                    ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-300 shadow-md transform -translate-y-0.5'
                    : 'border-slate-100 hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5'
                }`}
              >
                {/* Accent Tag indicator */}
                {isCurrentlySelected && (
                  <span className="absolute -top-2 px-2 py-0.5 right-4 rounded-full bg-blue-600 text-[9px] text-white font-mono uppercase tracking-wide shadow-sm font-bold animate-bounce">
                    Active Choice
                  </span>
                )}

                <div>
                  {/* Category Pill and rating */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono uppercase font-bold">
                      {car.type} Class
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span className="text-xs font-mono font-bold text-slate-600">{car.rating}</span>
                    </div>
                  </div>

                  {/* Modern Decorative Vector Container instead of broken images */}
                  <div className={`h-28 rounded-xl bg-gradient-to-br ${car.imageColor} flex items-center justify-center p-4 shadow-inner relative overflow-hidden mb-3.5 group`}>
                    {/* Visual background element */}
                    <div className="absolute inset-0 bg-radial from-transparent to-black/20 opacity-30"></div>
                    <div className="text-5xl drop-shadow-md transform group-hover:scale-110 transition-transform duration-300 select-none">
                      {getCarEmoji(car.name)}
                    </div>
                    {/* Absolute dynamic details watermarked inside container */}
                    <div className="absolute bottom-1 right-2 text-[10px] text-white/50 font-mono">
                      {car.fuelType} Powered
                    </div>
                  </div>

                  {/* Title details */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{car.brand}</span>
                    <h3 className="text-base font-bold text-slate-850 mt-0.5">{car.name}</h3>
                  </div>

                  {/* Vehicle Quick Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 text-slate-500">
                    <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                      <Gauge className="w-3.5 h-3.5 text-slate-400 mb-1" />
                      <span className="text-[10px] font-mono leading-none font-bold text-slate-600">{car.transmission}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                      <Disc className="w-3.5 h-3.5 text-slate-400 mb-1" />
                      <span className="text-[10px] font-mono leading-none font-bold text-slate-600">{car.fuelType}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center p-1 bg-slate-50 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-slate-400 mb-1" />
                      <span className="text-[10px] font-mono leading-none font-bold text-slate-600">{car.seats} Seats</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA: Pricing & Selection Action */}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-semibold">Daily Rent Rate</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg font-extrabold font-mono text-slate-800">${car.pricePerDay}</span>
                      <span className="text-xs text-slate-500 font-medium">/day</span>
                    </div>
                  </div>

                  <button
                    id={`btn-select-car-${car.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCar(car);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold select-none transition-all cursor-pointer ${
                      isCurrentlySelected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isCurrentlySelected ? 'Selected ✓' : 'Rent This Car'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
          <CarFront className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-600">No Vehicles Match Criteria</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try lowering the budget slider, typing another keyword, or resetting the transmission mode filter!</p>
          <button
            id="btn-reset-filters"
            onClick={() => setFilters({ search: '', type: 'All', transmission: 'All', maxPrice: 150 })}
            className="mt-3.5 px-3.5 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg bg-white font-medium hover:bg-blue-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
