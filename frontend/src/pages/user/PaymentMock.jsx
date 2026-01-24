import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/client';

const PaymentMock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [step, setStep] = useState('method'); // method, processing, success
    const [paymentMethod, setPaymentMethod] = useState('');
    const planAmount = location.state?.amount || 199;

    const handlePayment = async () => {
        if (!paymentMethod) {
            showToast("Please select a payment method", "error");
            return;
        }

        setStep('processing');

        // Simulate processing delay
        setTimeout(async () => {
            try {
                // Call API to upgrade user
                const token = localStorage.getItem('token');
                const response = await apiClient.post('/auth/buy-gold', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    // Update local storage
                    const user = JSON.parse(localStorage.getItem('user'));
                    const updatedUser = { ...user, isGoldMember: true };
                    localStorage.setItem('user', JSON.stringify(updatedUser));

                    setStep('success');

                    // Auto redirect after success animation
                    setTimeout(() => {
                        showToast("Upgrade Successful! Welcome to Gold. 👑", "success");
                        navigate('/user/profile');
                    }, 3000);
                }
            } catch (error) {
                console.error("Payment failed:", error);
                showToast("Payment Failed. Please try again.", "error");
                setStep('method');
            }
        }, 2000);
    };

    if (step === 'processing') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h2 className="text-2xl font-bold text-gray-800">Processing Payment...</h2>
                <p className="text-gray-500 mt-2">Please do not close this window.</p>
                <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="text-sm font-bold text-gray-600">Secure Gateway</span>
                    <span className="text-green-500 text-xs">🔒 256-bit SSL</span>
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center font-sans text-center px-6">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-lg animate-bounce">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 text-lg mb-8">You are now a <span className="text-[#FFD700] font-black bg-black px-2 py-0.5 rounded">Vindu Gold</span> Member.</p>
                <p className="text-gray-400 text-sm">Redirecting to profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans'] text-gray-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-black text-xl italic tracking-tighter">Vindu<span className="text-[#FF5E00]">.</span> Pay</span>
                </div>
                <div className="text-sm font-bold text-gray-500">Order ID: #{Math.floor(Math.random() * 1000000)}</div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Left: Summary */}
                <div className="md:col-span-4 order-2 md:order-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-6">Order Summary</h3>

                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-lg flex items-center justify-center text-lg">👑</div>
                                <div>
                                    <div className="font-bold text-sm">Vindu Gold</div>
                                    <div className="text-xs text-gray-400">Monthly Plan</div>
                                </div>
                            </div>
                            <div className="font-bold">₹{planAmount}</div>
                        </div>

                        <div className="border-t border-dashed border-gray-200 my-4"></div>

                        <div className="flex justify-between items-center mb-2 text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>₹{planAmount}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6 text-sm">
                            <span className="text-gray-500">Tax (18% GST)</span>
                            <span>₹{(planAmount * 0.18).toFixed(2)}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <span className="font-black text-lg">Total Pay</span>
                            <span className="font-black text-xl text-[#FF5E00]">₹{(planAmount * 1.18).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                        <span>🔒 Secure Transaction</span>
                        <span>•</span>
                        <span>Powered by MockPay</span>
                    </div>
                </div>

                {/* Right: Payment Methods */}
                <div className="md:col-span-8 order-1 md:order-2">
                    <h2 className="text-2xl font-black mb-8">Select Payment Method</h2>

                    <div className="space-y-4">
                        {/* UPI */}
                        <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#FF5E00] bg-[#FF5E00]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <input type="radio" name="payment" value="upi" onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#FF5E00]" />
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1">
                                <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-2085056-1747946.png" className="w-full" alt="UPI" />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">UPI</div>
                                <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</div>
                            </div>
                        </label>

                        {/* Card */}
                        <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#FF5E00] bg-[#FF5E00]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <input type="radio" name="payment" value="card" onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#FF5E00]" />
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xl">
                                💳
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">Credit / Debit Card</div>
                                <div className="text-xs text-gray-500">Visa, Mastercard, RuPay</div>
                            </div>
                        </label>

                        {/* Net Banking */}
                        <label className={`flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-[#FF5E00] bg-[#FF5E00]/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <input type="radio" name="payment" value="netbanking" onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#FF5E00]" />
                            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xl">
                                🏦
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">Net Banking</div>
                                <div className="text-xs text-gray-500">All Indian Banks</div>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handlePayment}
                        className={`mt-10 w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${paymentMethod ? 'bg-[#FF5E00] text-white hover:bg-[#e05200] transform hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        disabled={!paymentMethod}
                    >
                        Pay ₹{(planAmount * 1.18).toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMock;
