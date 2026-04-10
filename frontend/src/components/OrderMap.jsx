import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import { createControlComponent } from "@react-leaflet/core";

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
const BoundsHandler = ({ restaurant, customer, rider }) => {
    const map = useMap();
    useEffect(() => {
        const points = [];
        if (restaurant && typeof restaurant.lat === 'number') points.push([restaurant.lat, restaurant.lng]);
        if (customer && typeof customer.lat === 'number') points.push([customer.lat, customer.lng]);
        if (rider && typeof rider.lat === 'number') points.push([rider.lat, rider.lng]);

        if (points.length === 0) return;

        try {
            if (points.length === 1) {
                // If only one point, fly to it
                map.flyTo(points[0], 16, { duration: 1.5 });
            } else {
                // If multiple points, fit to bounds
                const bounds = L.latLngBounds(points);
                map.fitBounds(bounds, { padding: [70, 70], maxZoom: 16 });
            }
        } catch (err) {
            console.error("Leaflet bounds error:", err);
        }
    }, [restaurant?.lat, restaurant?.lng, customer?.lat, customer?.lng, rider?.lat, rider?.lng, map]);
    return null;
};

// Road-Based Routing Layer
const RoutingLayer = createControlComponent(({ pickup, dropoff }) => {
    return L.Routing.control({
        waypoints: [L.latLng(pickup), L.latLng(dropoff)],
        router: L.Routing.osrmv1({ 
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving'
        }),
        lineOptions: {
            styles: [
                { color: '#FF5E00', weight: 8, opacity: 0.2 }, // External Glow
                { color: '#FF5E00', weight: 4, opacity: 1 }      // Main Path
            ]
        },
        show: false, // Hide the text instructions panel
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false, // We use BoundsHandler for this
        createMarker: () => null // Hide default routing markers (we use our own icons)
    });
});

const OrderMap = ({ restaurant, customer, rider, className }) => {
    // Default fallback (e.g., Delhi center) if no coordinates provided
    const defaultCenter = [28.6139, 77.2090];

    // Defensive check for coordinate validity (handles strings and numbers)
    const isValid = (loc) => {
        if (!loc) return false;
        const lat = parseFloat(loc.lat);
        const lng = parseFloat(loc.lng);
        return !isNaN(lat) && !isNaN(lng);
    };

    const getCenter = () => {
        if (isValid(rider)) return [parseFloat(rider.lat), parseFloat(rider.lng)];
        if (isValid(restaurant)) return [parseFloat(restaurant.lat), parseFloat(restaurant.lng)];
        if (isValid(customer)) return [parseFloat(customer.lat), parseFloat(customer.lng)];
        return defaultCenter;
    };

    const center = getCenter();

    // Force re-render when coordinates change to ensure MapContainer re-initializes correctly
    const mapKey = `map-${restaurant?.lat || 0}-${customer?.lat || 0}-${rider?.lat || 0}`;

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
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Road Path Logic */}
                {isValid(restaurant) && isValid(customer) && (
                    <RoutingLayer 
                        pickup={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]} 
                        dropoff={[parseFloat(customer.lat), parseFloat(customer.lng)]} 
                    />
                )}

                {isValid(restaurant) && (
                    <Marker position={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]} icon={restaurantIcon}>
                        <Popup>Restaurant pickup</Popup>
                    </Marker>
                )}

                {isValid(customer) && (
                    <Marker position={[parseFloat(customer.lat), parseFloat(customer.lng)]} icon={homeIcon}>
                        <Popup>Your Home</Popup>
                    </Marker>
                )}

                {isValid(rider) && (
                    <Marker position={[parseFloat(rider.lat), parseFloat(rider.lng)]} icon={riderIcon}>
                        <Popup>Rider is here</Popup>
                    </Marker>
                )}

                {(isValid(restaurant) || isValid(customer) || isValid(rider)) && (
                    <BoundsHandler restaurant={restaurant} customer={customer} rider={rider} />
                )}
            </MapContainer>
        </div>
    );
};

export default OrderMap;
