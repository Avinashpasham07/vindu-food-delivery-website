import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Icons
const restaurantIcon = new L.DivIcon({
    html: `<div style="background-color: #111; border: 2px solid #555; border-radius: 50%; width: 40px; height: 40px; display: flex; items-center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(0,0,0,0.5);">👨‍🍳</div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const homeIcon = new L.DivIcon({
    html: `<div style="background-color: #FF5E00; border: 2px solid white; border-radius: 50%; width: 40px; height: 40px; display: flex; items-center; justify-content: center; font-size: 20px; box-shadow: 0 0 15px rgba(255,94,0,0.5);">🏠</div>`,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

const riderIcon = new L.DivIcon({
    html: `<div style="background-color: white; border: 3px solid #FF5E00; border-radius: 50%; width: 48px; height: 48px; display: flex; items-center; justify-content: center; font-size: 24px; box-shadow: 0 0 20px rgba(255,94,0,0.6);">🛵</div>`,
    className: 'custom-div-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
});

// Component to auto-focus map on markers
const BoundsHandler = ({ stops = [], customer }) => {
    const map = useMap();
    const isValid = (loc) => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';

    useEffect(() => {
        if (stops.length > 0 && isValid(customer)) {
            const bounds = L.latLngBounds([
                ...stops.map(s => [s.lat, s.lng]),
                [customer.lat, customer.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [stops, customer, map]);
    return null;
};

const OrderMap = ({ restaurant, restaurants = [], customer, rider, className }) => {
    // Default fallback (e.g., Delhi center) if no coordinates provided
    const defaultCenter = [28.6139, 77.2090];

    // Defensive check for coordinate validity
    const isValid = (loc) => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';

    // Filter valid stops early to avoid TDZ errors
    const stops = restaurants.filter(isValid);
    if (!stops.length && isValid(restaurant)) stops.push(restaurant);

    const center = isValid(rider)
        ? [rider.lat, rider.lng]
        : (isValid(restaurant) 
            ? [restaurant.lat, restaurant.lng] 
            : (stops.length > 0 ? [stops[0].lat, stops[0].lng] : defaultCenter));

    // Force re-render when order IDs change to ensure MapContainer re-initializes
    const mapKey = restaurant?.id || restaurant?._id || (stops.length > 0 ? stops[0]._id : 'initial-map');

    return (
        <div className={`w-full h-full min-h-[400px] ${className}`} style={{ minHeight: '400px' }}>
            <MapContainer
                key={mapKey}
                center={center}
                zoom={14}
                scrollWheelZoom={true}
                zoomControl={false}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
            >
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Maps'
                />

                {/* Connecting Lines: Rider -> Stop1 -> Stop2 -> Stop3 -> Customer */}
                {stops.length > 0 && isValid(customer) && (
                    <Polyline
                        positions={[
                            ...stops.map(s => [s.lat, s.lng]),
                            [customer.lat, customer.lng]
                        ]}
                        color="#FF5E00"
                        weight={4}
                        opacity={0.6}
                        dashArray="10, 10"
                    />
                )}

                {/* All Restaurant Stops */}
                {stops.map((stop, index) => (
                    isValid(stop) && (
                        <Marker 
                            key={`ord-stop-${index}`} 
                            position={[parseFloat(stop.lat), parseFloat(stop.lng)]} 
                            icon={new L.DivIcon({
                                html: `<div style="background-color: ${index === 0 ? '#111' : '#222'}; border: 2px solid ${index === 0 ? '#FF5E00' : '#444'}; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                                         ${index === 0 ? '👨‍🍳' : '🏢'}
                                       </div>`,
                                className: 'custom-div-icon',
                                iconSize: [40, 40],
                                iconAnchor: [20, 20],
                            })}
                        >
                            <Popup>{stop.name || `Restaurant ${index + 1}`}</Popup>
                        </Marker>
                    )
                ))}

                {isValid(customer) && (
                    <Marker position={[customer.lat, customer.lng]} icon={homeIcon}>
                        <Popup>Your Home</Popup>
                    </Marker>
                )}

                {isValid(rider) && (
                    <Marker position={[rider.lat, rider.lng]} icon={riderIcon}>
                        <Popup>Rider is here</Popup>
                    </Marker>
                )}

                {stops.length > 0 && isValid(customer) && (
                    <BoundsHandler stops={stops} customer={customer} />
                )}
            </MapContainer>
        </div>
    );
};

export default OrderMap;
