import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

// Custom Marker Icon for Leaflet
import L from 'leaflet';
const restaurantIcon = new L.DivIcon({
    html: `<div style="background-color: #10B981; border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; items-center; justify-content: center; font-size: 16px; box-shadow: 0 0 10px rgba(16,185,129,0.5);">🍴</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

const PartnerProfile = () => {
    const navigate = useNavigate();
    const [partner, setPartner] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPartnerData = async () => {
            const storedPartner = localStorage.getItem('partner');
            if (storedPartner) {
                const p = JSON.parse(storedPartner);
                setPartner(p);
                setFormData(p);

                // Fetch fresh data from server to ensure sync
                try {
                    const partnerId = p.id || p._id;
                    const res = await apiClient.get(`/auth/partner/${partnerId}`);
                    setPartner(res.data.partner);
                    setFormData(res.data.partner);
                } catch (err) {
                    console.error("Failed to fetch fresh partner data:", err);
                }
            } else {
                navigate('/food-partner/login');
            }
        };

        fetchPartnerData();
    }, [navigate]);

    const isValidLocation = (loc) => loc && typeof loc.lat === 'number' && typeof loc.lng === 'number';

    const handleSave = async () => {
        setIsSaving(true);
        const { _id, id, __v, email, role, ...updateData } = formData;
        
        try {
            const partnerId = partner.id || partner._id;
            console.log("Saving Partner Profile:", { partnerId, updateData });
            
            const res = await apiClient.put(`/auth/partner/update/${partnerId}`, updateData);
            
            setPartner(res.data.partner);
            setFormData(res.data.partner);
            localStorage.setItem('partner', JSON.stringify(res.data.partner));
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            const errorMsg = error.response?.data?.message || "Failed to update profile";
            toast.error(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    if (!partner) {
        return <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-white">Loading Profile...</div>;
    }

    // Logic to re-center map ONLY when initial data is loaded or saved
    // We use a stable key based on the partner's unique ID to prevent flickering on every click
    const mapKey = `map-${partner?.id || partner?._id || 'initial'}`;

    const mapCenter = isValidLocation(formData.location) 
        ? [formData.location.lat, formData.location.lng] 
        : [28.6139, 77.2090];

    // Component to automatically fly the map to the selected location
    const MapAutoCenter = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.flyTo(center, 15, { duration: 1.5 });
            }
        }, [center, map]);
        return null;
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setFormData(prev => ({
                    ...prev,
                    location: { lat: e.latlng.lat, lng: e.latlng.lng }
                }));
            },
        });

        return isValidLocation(formData.location) ? (
            <Marker position={[formData.location.lat, formData.location.lng]} icon={restaurantIcon} />
        ) : null;
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white font-['Plus_Jakarta_Sans'] p-6 md:p-12">
            <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden p-8 shadow-2xl relative">
                {/* Decorative Background for Header */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#10B981]/20 to-transparent"></div>

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 mt-4">
                    <div className="w-32 h-32 rounded-full border-4 border-[#10B981] bg-[#222] flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-black text-white">{partner.name?.[0]}</span>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white mb-2">{partner.name}</h1>
                        <p className="text-gray-400 text-lg flex items-center justify-center md:justify-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-[#10B981]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {partner.address || "No address set"}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                Verified Partner
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Business Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#10B981]"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        ) : (
                            <div className="text-white text-lg font-medium">{partner.name}</div>
                        )}
                    </div>
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="text"
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#10B981]"
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        ) : (
                            <div className="text-white text-lg font-medium">{partner.phone || "N/A"}</div>
                        )}
                    </div>
                    <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/5 md:col-span-2">
                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">Physical Address</label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 bg-[#111] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-[#10B981]"
                                    value={formData.address || ''}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Enter full address (e.g., Ghatkesar, Medchal)"
                                />
                                <button
                                    onClick={async () => {
                                        if (!formData.address) {
                                            toast.error("Please enter an address first");
                                            return;
                                        }
                                        const loadingToast = toast.loading("Finding address...");
                                        try {
                                            // Search with address + restaurant name for better accuracy
                                            const query = `${formData.address}, ${formData.name || ''}`;
                                            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
                                            const data = await res.json();
                                            
                                            if (data && data.length > 0) {
                                                const { lat, lon } = data[0];
                                                setFormData(prev => ({
                                                    ...prev,
                                                    location: { lat: parseFloat(lat), lng: parseFloat(lon) }
                                                }));
                                                toast.success("Location found!", { id: loadingToast });
                                            } else {
                                                // Try again with just the address if combined search fails
                                                const res2 = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.address)}&format=json&limit=1`);
                                                const data2 = await res2.json();
                                                if (data2 && data2.length > 0) {
                                                    const { lat, lon } = data2[0];
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        location: { lat: parseFloat(lat), lng: parseFloat(lon) }
                                                    }));
                                                    toast.success("Address found!", { id: loadingToast });
                                                } else {
                                                    toast.error("Could not find that location. Please pin it manually.", { id: loadingToast });
                                                }
                                            }
                                        } catch (err) {
                                            toast.error("Geocoding failed", { id: loadingToast });
                                        }
                                    }}
                                    className="bg-[#10B981]/20 text-[#10B981] px-4 rounded-lg font-bold hover:bg-[#10B981]/30 transition"
                                    title="Find on Map"
                                >
                                    🔍
                                </button>
                            </div>
                        ) : (
                            <div className="text-white text-lg font-medium">{partner.address || "No address set"}</div>
                        )}
                    </div>
                </div>

                {/* Location Picker Map */}
                <div className="mt-8">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-4">Restaurant GPS Location</label>
                    <div className="h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
                        <MapContainer
                            key={mapKey}
                            center={mapCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                            />
                            {isEditing && <MapAutoCenter center={mapCenter} />}
                            {isEditing && <LocationMarker />}
                            {!isEditing && isValidLocation(formData.location) && (
                                <Marker position={[formData.location.lat, formData.location.lng]} icon={restaurantIcon} />
                            )}
                        </MapContainer>
                    </div>
                    {isEditing && <p className="text-[10px] text-gray-500 mt-2 italic">Click on the map to set your restaurant's exact pin location.</p>}
                </div>

                <div className="mt-10 flex gap-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 px-8 py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition shadow-lg shadow-[#10B981]/20 disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => { setIsEditing(false); setFormData(partner); }}
                                className="flex-1 px-8 py-3 rounded-xl bg-[#222] text-white font-bold hover:bg-[#333] transition"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full px-8 py-3 rounded-xl bg-[#222] text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-white font-bold transition shadow-lg"
                        >
                            Update Business Profile & Location
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PartnerProfile;
