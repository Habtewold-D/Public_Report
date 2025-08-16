import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  // Optional currently selected location to display as a marker
  selectedLocation?: { lat: number; lng: number } | null;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    status: 'open' | 'progress' | 'resolved';
  }>;
  className?: string;
}

const MapComponent = ({ 
  center = [9.0192, 38.7525], // Addis Ababa coordinates
  zoom = 12,
  onLocationSelect,
  selectedLocation = null,
  markers = [],
  className = "w-full h-64"
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Add click handler for location selection
    if (onLocationSelect) {
      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // Update or create selection marker
        if (selectionMarkerRef.current) {
          selectionMarkerRef.current.setLatLng([lat, lng]);
        } else if (mapInstanceRef.current) {
          selectionMarkerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        }
        onLocationSelect(lat, lng);
      });
    }

    // Add markers
    markers.forEach((marker) => {
      if (mapInstanceRef.current) {
        const color = marker.status === 'resolved' ? '#059669' : 
                     marker.status === 'progress' ? '#3b82f6' : '#f59e0b';
        
        const customIcon = L.divIcon({
          html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [20, 20],
          className: 'custom-marker'
        });

        L.marker([marker.lat, marker.lng], { icon: customIcon })
          .bindPopup(`<strong>${marker.title}</strong><br/>Status: ${marker.status}`)
          .addTo(mapInstanceRef.current);
      }
    });

    // If a selected location is provided initially, show its marker
    if (selectedLocation && mapInstanceRef.current) {
      selectionMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], zoom);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, onLocationSelect, markers, selectedLocation]);

  // Keep selection marker in sync with prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedLocation) {
      if (selectionMarkerRef.current) {
        selectionMarkerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      } else {
        selectionMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(mapInstanceRef.current);
      }
    } else {
      // Remove selection marker if cleared
      if (selectionMarkerRef.current) {
        selectionMarkerRef.current.remove();
        selectionMarkerRef.current = null;
      }
    }
  }, [selectedLocation]);

  return <div ref={mapRef} className={className} />;
};

export default MapComponent;