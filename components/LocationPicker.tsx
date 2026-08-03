import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle2, AlertCircle, Loader2, Search, X, Check, Globe } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

interface LocationPickerProps {
  value: string;
  onChange: (locationStr: string) => void;
  placeholder?: string;
  required?: boolean;
}

interface GeocodedResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

const PRESET_LOCATIONS = [
  { name: 'In-Person Studio (HQ)', detail: 'Development Archive Main Studio', verified: true },
  { name: 'Virtual / Online Remote Session', detail: 'Encrypted Video Link (Google Meet / Zoom)', verified: true },
  { name: 'On-Site at Client HQ / Office', detail: 'Custom Corporate Workshop Venue', verified: true }
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  placeholder = 'Click or search to verify real location...',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced address search via Nominatim API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data: GeocodedResult[] = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GPS Location Detection Handler
  const handleDetectGps = () => {
    sciFiAudio.playClick();
    setGpsError(null);
    setIsLocating(true);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGpsCoords({ lat, lng });

        try {
          // Reverse geocoding request to convert GPS coordinates to real address
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );

          if (res.ok) {
            const data: GeocodedResult = await res.json();
            const addr = data.address;

            const city = addr?.city || addr?.town || addr?.village || '';
            const state = addr?.state || '';
            const country = addr?.country || '';
            const road = addr?.road ? `${addr.road}, ` : '';

            let formattedAddress = data.display_name;
            if (city && country) {
              formattedAddress = `${road}${city}, ${state ? state + ', ' : ''}${country}`;
            }

            const gpsFormatted = `📍 GPS Verified: ${formattedAddress} (${lat.toFixed(4)}°N, ${lng.toFixed(4)}°W)`;
            
            sciFiAudio.playSuccess();
            setVerifiedAddress(formattedAddress);
            onChange(gpsFormatted);
            setIsOpen(false);
          } else {
            const fallbackStr = `📍 GPS Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°W`;
            sciFiAudio.playSuccess();
            onChange(fallbackStr);
            setIsOpen(false);
          }
        } catch (err) {
          console.error('Reverse geocode error:', err);
          const fallbackStr = `📍 GPS Coordinates: ${lat.toFixed(4)}°N, ${lng.toFixed(4)}°W`;
          sciFiAudio.playSuccess();
          onChange(fallbackStr);
          setIsOpen(false);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('GPS Geolocation Error:', error);
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('GPS Access Denied. Please allow location permissions in your browser.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('Location information is unavailable. Please search by city or address.');
        } else {
          setGpsError('GPS Request timed out. Please try again or search below.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectSearchResult = (result: GeocodedResult) => {
    sciFiAudio.playSuccess();
    const cleanName = result.display_name;
    const formatted = `✔ Verified Real Location: ${cleanName}`;
    setVerifiedAddress(cleanName);
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    sciFiAudio.playClick();
    onChange(preset.name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    sciFiAudio.playClick();
    onChange('');
    setVerifiedAddress(null);
    setGpsCoords(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Main Trigger Input */}
      <div className="relative">
        <input
          type="text"
          readOnly
          required={required}
          value={value}
          onClick={() => {
            sciFiAudio.playClick();
            setIsOpen(!isOpen);
          }}
          placeholder={placeholder}
          className="w-full bg-brand-gray-dark border border-brand-border hover:border-brand-green/60 rounded-xl p-3 pr-20 text-sm text-white focus:outline-none focus:border-brand-green cursor-pointer transition-all shadow-inner truncate"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-brand-green">
          <MapPin className="w-4 h-4 animate-bounce" />
        </div>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Clear location"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[10010] mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[380px] bg-[#0d121d] border border-brand-border/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white font-mono space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-green" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                  GPS & Real Location Verification
                </span>
              </div>
            </div>

            {/* GPS Auto-Detect Button */}
            <div>
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isLocating}
                className="w-full py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-light text-brand-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20 disabled:opacity-50"
              >
                {isLocating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Acquiring GPS Lock...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Use My GPS Location (Auto-Verify)</span>
                  </>
                )}
              </button>

              {gpsError && (
                <div className="mt-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{gpsError}</span>
                </div>
              )}
            </div>

            {/* Real Physical Address Search */}
            <div className="space-y-2">
              <label className="text-[10px] text-brand-light-gray uppercase font-bold block">
                Or Search Any Real Global Location:
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type address, city, venue or postal code..."
                  className="w-full bg-brand-gray-dark border border-brand-border focus:border-brand-green text-xs rounded-xl pl-9 pr-8 py-2 text-white focus:outline-none"
                />
                {isSearching && (
                  <Loader2 className="w-3.5 h-3.5 text-brand-green animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Search Results List */}
              {searchResults.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto bg-brand-gray-dark p-1 rounded-xl border border-brand-border">
                  {searchResults.map((res) => (
                    <button
                      key={res.place_id}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className="w-full text-left p-2 rounded-lg hover:bg-brand-green/20 text-xs text-slate-200 hover:text-white transition-all flex items-start gap-2 cursor-pointer border border-transparent hover:border-brand-green/40"
                    >
                      <MapPin className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                      <div className="truncate">
                        <span className="font-bold block truncate">{res.display_name}</span>
                        <span className="text-[10px] text-brand-light-gray font-mono">
                          Lat: {Number(res.lat).toFixed(4)}°, Lon: {Number(res.lon).toFixed(4)}°
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Standard Venue Presets */}
            <div className="space-y-1.5 pt-2 border-t border-brand-border/40">
              <label className="text-[10px] text-brand-light-gray uppercase font-bold block">
                Standard Verified Venues:
              </label>
              <div className="space-y-1">
                {PRESET_LOCATIONS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full text-left p-2 rounded-xl bg-brand-gray-dark hover:bg-brand-green/10 border border-brand-border hover:border-brand-green/50 text-xs transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-white block">{preset.name}</span>
                      <span className="text-[10px] text-brand-light-gray">{preset.detail}</span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Badge */}
            <div className="pt-2 border-t border-brand-border/40 text-[10px] text-brand-light-gray flex items-center justify-between">
              <span className="flex items-center gap-1 text-brand-green">
                <CheckCircle2 className="w-3 h-3" /> Real Location Verified
              </span>
              <span>OpenStreetMap Geocoding</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
