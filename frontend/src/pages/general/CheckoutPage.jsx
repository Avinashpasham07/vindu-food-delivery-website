import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSquad } from '../../context/SquadContext';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, 
    MapPin, 
    Check, 
    User, 
    Phone, 
    CreditCard, 
    Smartphone, 
    Banknote, 
    Flame, 
    ArrowRight, 
    ShieldCheck,
    Loader2,
    Star,
    PartyPopper
} from 'lucide-react';

const CheckoutPage = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { sharedCart, roomId, socket, leaveSquad, squadMembers } = useSquad(); // Get Squad Data
    const navigate = useNavigate();
    const location = useLocation();
    const squadAmt = location.state?.squadAmt;

    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [isLocating, setIsLocating] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const isOrderPlaced = React.useRef(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        lat: null,
        lng: null
    });

    const [paymentMethod, setPaymentMethod] = useState('card');

    // Determine which cart to use (Squad vs Local)
    const finalCart = roomId
        ? sharedCart.filter(item => (item.split?.[socket?.id] || 0) > 0).map(item => ({
            ...item,
            quantity: item.split[socket.id] // Override quantity with user's specific share
        }))
        : cart;

    // Totals
    // Calculate squad share if in a room
    const mySquadShare = roomId
        ? sharedCart.reduce((total, item) => total + (item.price * (item.split?.[socket?.id] || 0)), 0)
        : 0;

    // Totals
    const itemTotal = roomId ? (mySquadShare > 0 ? mySquadShare : squadAmt || 0) : cartTotal;
    const taxes = Math.round(itemTotal * 0.05);
    const deliveryFee = itemTotal > 500 ? 0 : 40;
    const grandTotal = itemTotal + taxes + deliveryFee;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        const geoToast = toast.loading('Waiting for GPS signal...');
 
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    toast.loading('Resolving address...', { id: geoToast });
                    const { latitude, longitude } = position.coords;
                    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                    
                    if (!apiKey) {
                        throw new Error('Maps API Key missing');
                    }

                    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                    const data = await response.json();
 
                    if (data.status === 'OK' && data.results.length > 0) {
                        const result = data.results[0];
                        const components = result.address_components;
                        
                        const getComponent = (types) => {
                            const comp = components.find(c => types.some(t => c.types.includes(t)));
                            return comp ? comp.long_name : '';
                        };

                        const subLocality = getComponent(['sublocality_level_1', 'sublocality']);
                        const locality = getComponent(['locality']);
                        const neighborhood = getComponent(['neighborhood']);
                        
                        // Smart address: Try to clean up the formatted address if it starts with a plus code
                        let bestAddress = result.formatted_address;
                        if (bestAddress.includes('+') && data.results[1]) {
                           bestAddress = data.results[1].formatted_address;
                        }

                        setFormData(prev => ({
                            ...prev,
                            address: bestAddress,
                            city: locality || subLocality || neighborhood || getComponent(['administrative_area_level_2']),
                            zip: getComponent(['postal_code']),
                            lat: latitude,
                            lng: longitude
                        }));
                        toast.success("Location locked!", {
                            id: geoToast,
                            icon: <MapPin className="w-5 h-5 text-[#FF5E00]" />
                        });
                    } else {
                        // Fallback: Use coordinates even if address resolution fails
                        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
                        toast.error(`Address not found (${data.status}). GPS coordinates captured!`, { id: geoToast });
                        console.warn("Google Maps Geocoding failed:", data);
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                    toast.error(`Error: ${error.message || 'Could not resolve address'}`, { id: geoToast });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                let msg = 'Unable to retrieve location';
                if (error.code === 1) msg = 'Location access denied. Please enable GPS.';
                else if (error.code === 2) msg = 'Position unavailable.';
                else if (error.code === 3) msg = 'Request timed out.';
                
                toast.error(msg, { id: geoToast });
                setIsLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handlePlaceOrder = async () => {
        // Validation
        if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.zip) {
            toast.error('Please fill in all delivery details');
            return;
        }

        if (!formData.lat || !formData.lng) {
            toast.error('Please click "Use Current Location" to enable real-time tracking!');
            return;
        }

        setIsPlacingOrder(true);

        try {
            // Try to get token for header, but rely on cookies if missing
            let token = localStorage.getItem('token');
            if (token === 'undefined') token = null;

            const orderData = {
                items: finalCart.map(item => ({
                    foodId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    // Cart uses item.video for media URL regardless of type
                    image: item.fileType === 'image' ? item.video : (item.image || ''),
                    video: item.fileType === 'video' ? item.video : ''
                })),
                totalAmount: grandTotal,
                address: formData,
                customerLocation: { lat: formData.lat, lng: formData.lng },
                paymentMethod: paymentMethod,
                couponCode: couponCode
            };

            // Use apiClient which sends cookies automatically. Also send header if we have token.
            const response = await apiClient.post('/orders/place', orderData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.status === 201) {
                isOrderPlaced.current = true;
                setPlacedOrderId(response.data.order._id);

                // Update Local Storage Streak
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && response.data.streak) {
                    user.streakCount = response.data.streak;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                if (response.data.reward) {
                    toast.success(`${response.data.reward.message}\nYour Reward Coupon: ${response.data.reward.coupon}`, {
                        icon: <PartyPopper className="w-5 h-5 text-yellow-400" />,
                        duration: 6000
                    });
                }

                setStep(3);
                clearCart();
                // Navigate to tracking directly
                navigate(`/order/tracking/${response.data.order._id}`);
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            const msg = error.response?.data?.message || error.message || 'Failed to place order';
            alert(`Error (${error.response?.status || 'Unknown'}): ${msg}`);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    React.useEffect(() => {
        if (finalCart.length === 0 && !isOrderPlaced.current && step !== 3) {
            navigate('/cart');
        }
    }, [finalCart, step, navigate]);

    if (finalCart.length === 0 && step !== 3) return null;

    if (step === 3) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center font-['Plus_Jakarta_Sans'] relative overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>

                <div className="relative z-10 bg-[#111]/80 backdrop-blur-3xl border border-white/10 p-12 rounded-[40px] shadow-2xl max-w-md w-full animate-fade-in-up">
                    <div className="w-24 h-24 bg-[#10B981] rounded-full flex items-center justify-center mb-8 mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Order Placed!</h1>
                    <p className="text-gray-400 mb-10 text-lg">Your food is being prepared with love.<br />Estimated delivery: <span className="text-white font-bold">35 mins</span></p>
                    {roomId ? (
                        <div className="space-y-3 w-full">
                            <button
                                onClick={() => {
                                    leaveSquad();
                                    navigate(`/order/tracking/${placedOrderId}`);
                                }}
                                className="w-full py-4 bg-[#FF5E00] hover:bg-[#ff7b29] rounded-2xl font-bold transition-all text-white text-lg hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                Track Live Order <MapPin className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => {
                                    leaveSquad();
                                    navigate('/home');
                                }}
                                className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                            >
                                Leave Squad & Go Home
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 w-full">
                            <button
                                onClick={() => navigate(`/order/tracking/${placedOrderId}`)}
                                className="w-full py-4 bg-[#FF5E00] hover:bg-[#ff7b29] rounded-2xl font-bold transition-all text-white text-lg hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                                Track Live Order <MapPin className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/home')}
                                className="w-full py-3 text-gray-400 hover:text-white font-bold transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] pb-32 relative overflow-x-hidden">

            {/* Ambient Backgrounds */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5E00]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF5E00]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-10 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12 animate-fade-in">
                    <button onClick={() => navigate(-1)} className="group p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </button>
                    <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-2 space-y-8 animate-slide-up">

                        {/* Section 1: Address */}
                        <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-colors duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-bold flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-full bg-[#FF5E00] flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF5E00]/20">1</span>
                                    Delivery Details
                                </h3>
                                <button
                                    onClick={handleUseLocation}
                                    disabled={isLocating}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#FF5E00]/10 hover:bg-[#FF5E00]/20 text-[#FF5E00] text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLocating ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <MapPin className="w-4 h-4" />
                                    )}
                                    {isLocating ? 'Locating...' : 'Use Current Location'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    icon={<User className="w-5 h-5" />}
                                />
                                <FormInput
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    icon={<Phone className="w-5 h-5" />}
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        name="address"
                                        placeholder="Street Address / Flat No"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        icon={<MapPin className="w-5 h-5" />}
                                    />
                                </div>
                                <FormInput
                                    name="city"
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                />
                                <FormInput
                                    name="zip"
                                    placeholder="ZIP Code"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Section 2: Payment */}
                        <div className="bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-colors duration-300" style={{ animationDelay: '100ms' }}>
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-4">
                                <span className="w-10 h-10 rounded-full bg-[#FF5E00] flex items-center justify-center text-sm font-black shadow-lg shadow-[#FF5E00]/20">2</span>
                                Payment Method
                            </h3>

                            <div className="space-y-4">
                                <PaymentOption
                                    id="card"
                                    title="Credit / Debit Card"
                                    desc="Secure payment via Stripe"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<CreditCard className="w-6 h-6" />}
                                />
                                <PaymentOption
                                    id="upi"
                                    title="UPI"
                                    desc="Google Pay, PhonePe, Paytm"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<Smartphone className="w-6 h-6" />}
                                />
                                <PaymentOption
                                    id="cod"
                                    title="Cash on Delivery"
                                    desc="Pay when you receive"
                                    selected={paymentMethod}
                                    setSelected={setPaymentMethod}
                                    icon={<Banknote className="w-6 h-6" />}
                                />
                            </div>
                        </div>

                        {/* Squad Bill Breakdown Section */}
                        {roomId && (
                            <div className="mt-8 bg-[#111]/80 backdrop-blur-md border border-white/5 rounded-[32px] p-8 animate-slide-up" style={{ animationDelay: '150ms' }}>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-4 text-white">
                                    <span className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-sm font-black shadow-lg shadow-[#8B5CF6]/20">3</span>
                                    Squad Bill Split
                                </h3>

                                <div className="space-y-4">
                                    {squadMembers?.map((member) => {
                                        const memberItems = sharedCart.filter(item => (item.split?.[member.id] || 0) > 0);
                                        const memberTotal = memberItems.reduce((total, item) => total + (item.price * (item.split?.[member.id] || 0)), 0);
                                        const isMe = member.id === socket?.id;

                                        return (
                                            <div key={member.id} className={`p-4 rounded-xl border transition-all ${isMe ? 'bg-[#FF5E00]/10 border-[#FF5E00]/50' : 'bg-white/5 border-white/5'}`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${member.avatar ? '' : (isMe ? 'bg-[#FF5E00]' : 'bg-gray-700')}`}>
                                                            {member.avatar ? <img src={member.avatar} className="w-full h-full rounded-full object-cover" /> : member.name[0]}
                                                        </div>
                                                        <div>
                                                            <span className={`text-sm font-bold ${isMe ? 'text-white' : 'text-gray-300'}`}>{member.name} {isMe && '(You)'}</span>
                                                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">{isMe ? 'Paying Now' : 'Pending'}</span>
                                                        </div>
                                                    </div>
                                                    <span className="text-lg font-bold text-white">₹{memberTotal}</span>
                                                </div>

                                                {memberItems.length > 0 && (
                                                    <div className="pl-11 text-sm space-y-1">
                                                        {memberItems.map(item => (
                                                            <div key={item._id} className="flex justify-between text-gray-400">
                                                                <span>{item.split[member.id]}x {item.name}</span>
                                                                <span>₹{item.price * item.split[member.id]}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sticky top-24 animate-fade-in-up relative overflow-hidden" style={{ animationDelay: '200ms' }}>

                            {/* Gradient Top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5E00] to-[#ff9e66]"></div>

                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-extrabold text-2xl">Order Summary</h3>
                                {squadAmt && (
                                    <span className="bg-[#FF5E00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Squad Share
                                    </span>
                                )}
                            </div>

                            {/* Cart Mini List with Scroll if too long */}
                            <div className="space-y-4 mb-8 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {finalCart.map(item => (
                                    <div key={item._id} className="flex justify-between items-center text-sm group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 shrink-0 overflow-hidden">
                                                {item.fileType === 'image' ? (
                                                    <img src={item.video} className="w-full h-full object-cover" />
                                                ) : (
                                                    <video src={item.video} className="w-full h-full object-cover" muted />
                                                )}
                                            </div>
                                            <span className="text-gray-300 truncate font-medium group-hover:text-white transition-colors">
                                                <span className="text-[#FF5E00] font-bold mr-1">{item.quantity}x</span>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-white font-bold ml-2">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="h-px bg-white/10 my-6"></div>

                            {/* Coupon Section */}
                            <div className="mb-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF5E00] mb-3 block">Promo Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="STREAK7..."
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#FF5E00] outline-none transition-all placeholder:text-gray-700 uppercase"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">Earn discounts by maintaining your order streak! <Flame className="w-3 h-3 text-[#FF5E00]" /></p>
                            </div>

                            <div className="h-px bg-white/10 my-6"></div>

                            <div className="space-y-4 text-sm font-medium text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{itemTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    <span className="text-white">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes</span>
                                    <span className="text-white">₹{taxes}</span>
                                </div>
                                <div className="flex justify-between items-end text-white pt-4 border-t border-white/10 mt-2">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-3xl font-black text-[#FF5E00]">₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isPlacingOrder}
                                className="w-full mt-8 bg-gradient-to-r from-[#FF5E00] to-[#ff7b29] hover:from-[#ff4500] hover:to-[#ff5e00] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-orange-500/20 transform transition-all hover:scale-[1.02] active:scale-[0.98] group flex justify-center items-center gap-2 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay & Place Order
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex justify-center items-center gap-2 opacity-60">
                                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SSL Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

// --- Helper Components for clean code ---

const FormInput = ({ name, placeholder, value, onChange, icon }) => (
    <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF5E00] transition-colors">
            {icon}
        </div>
        <input
            type="text"
            name={name}
            placeholder={placeholder}
            className={`w-full bg-[#050505] border border-white/10 rounded-2xl p-4 ${icon ? 'pl-12' : 'pl-6'} text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600`}
            value={value}
            onChange={onChange}
        />
    </div>
);

const PaymentOption = ({ id, title, desc, selected, setSelected, icon }) => (
    <label
        className={`flex items-center gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 group
        ${selected === id
                ? 'bg-[#FF5E00]/10 border-[#FF5E00] shadow-[0_0_30px_rgba(255,94,0,0.1)]'
                : 'bg-[#1a1a1a]/50 border-white/5 hover:bg-[#1a1a1a] hover:border-white/20'
            }`}
    >
        <div className="relative">
            <input
                type="radio"
                name="payment"
                value={id}
                checked={selected === id}
                onChange={() => setSelected(id)}
                className="peer sr-only"
            />
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${selected === id ? 'border-[#FF5E00] bg-[#FF5E00]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
        </div>

        <div className={`p-3 rounded-xl transition-colors ${selected === id ? 'bg-[#FF5E00] text-white' : 'bg-[#222] text-gray-400'}`}>
            {icon}
        </div>

        <div className="flex-1">
            <span className={`font-bold block text-lg ${selected === id ? 'text-white' : 'text-gray-300'}`}>{title}</span>
            <span className="text-sm text-gray-500">{desc}</span>
        </div>
    </label>
);

export default CheckoutPage;
