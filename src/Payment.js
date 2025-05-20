import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan || 'Standard';
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  // Set the price based on the selected plan (match Subscribe.js)
  const getPriceInfo = () => {
    switch(plan) {
      case 'Premium':
        return { price: 499, period: 'month' };
      case 'Standard':
        return { price: 299, period: 'month' };
      default:
        return { price: 99, period: 'month' };
    }
  };

  const { price, period } = getPriceInfo();

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setFields({});
    setErrors({});
  };

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!agreed) newErrors.agreed = 'You must agree to the terms.';
    if (paymentMethod === 'card') {
      if (!fields.cardNumber) newErrors.cardNumber = 'Card number required';
      if (!fields.expiry) newErrors.expiry = 'Expiry date required';
      if (!fields.cvv) newErrors.cvv = 'CVV required';
    }
    if (paymentMethod === 'bank') {
      if (!fields.bank) newErrors.bank = 'Select your bank';
    }
    if (paymentMethod === 'upi') {
      if (!fields.upi && !fields.qrScanned) newErrors.upi = 'Enter UPI ID or scan QR';
    }
    if (paymentMethod === 'wallet') {
      if (!fields.wallet) newErrors.wallet = 'Select a wallet';
    }
    return newErrors;
  };

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleWalletSelect = (wallet) => {
    setFields({ ...fields, wallet });
    setErrors({ ...errors, wallet: undefined });
  };

  const handlePay = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Simulate payment success
    alert('Payment successful!');
    navigate('/');
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-2">
      <div className="max-w-xs w-full flex flex-col items-center justify-center" style={{ minWidth: 320 }}>
        {/* Header with gradient background */}
        <div className="payment-header" style={{ padding: '18px 12px 10px 12px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Complete Your Payment</h2>
          <p style={{ fontSize: '1.15rem' }}>You selected the {plan} Plan</p>
        </div>

        {/* Payment card */}
        <div className="bg-white rounded-b-xl shadow-lg" style={{ width: '70%',padding:'50px',marginLeft:'200px'  ,display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Plan summary */}
          <div className="p-3 border-b border-gray-200" style={{ padding: '16px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="text-gray-500 text-xs" style={{ fontSize: 16 }}>Selected plan</p>
              <h3 className="text-base font-bold text-gray-800" style={{ fontSize: 20 }}>{plan}</h3>
              <p className="text-gray-500 text-xs" style={{ fontSize: 16, marginTop: 8 }}>Total amount</p>
              <p className="text-xl font-bold text-gray-800" style={{ fontSize: 22 }}>₹{price}</p>
              <p className="text-gray-500 text-xs" style={{ fontSize: 14 }}>per {period}</p>
            </div>
          </div>

          {/* Payment methods */}
          <div className="payment-methods-container" style={{ padding: '14px 10px 0 10px', width: '100%' }}>
            <h3 style={{ fontSize: 15, marginBottom: 10, textAlign: 'center' }}>Select Payment Method</h3>
            
            <div
              className="payment-methods"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 10,
                alignItems: 'center',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
                <div 
                  className={`payment-method ${paymentMethod === 'bank' ? 'selected' : ''}`}
                  style={{ minWidth: 70, padding: '10px 4px', flex: 1, textAlign: 'center' }}
                  onClick={() => handlePaymentSelect('bank')}
                >
                  <div className="payment-icon bank-icon"></div>
                  <p style={{ fontSize: 12 }}>Net Banking</p>
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                  style={{ minWidth: 70, padding: '10px 4px', flex: 1, textAlign: 'center' }}
                  onClick={() => handlePaymentSelect('card')}
                >
                  <div className="payment-icon card-icon"></div>
                  <p style={{ fontSize: 12 }}>Credit/Debit Card</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'center' }}>
                <div 
                  className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  style={{ minWidth: 70, padding: '10px 4px', flex: 1, textAlign: 'center' }}
                  onClick={() => handlePaymentSelect('upi')}
                >
                  <div className="payment-icon upi-icon"></div>
                  <p style={{ fontSize: 12 }}>UPI / QR</p>
                </div>
                <div 
                  className={`payment-method ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                  style={{ minWidth: 70, padding: '10px 4px', flex: 1, textAlign: 'center' }}
                  onClick={() => handlePaymentSelect('wallet')}
                >
                  <div className="payment-icon wallet-icon"></div>
                  <p style={{ fontSize: 12 }}>Wallets</p>
                </div>
              </div>
            </div>

            {/* Payment form - show different form based on selected method */}
            <form className="payment-form" onSubmit={handlePay} style={{ marginTop: 10, marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {paymentMethod === 'card' && (
                <div className="card-payment" style={{ padding: 8, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="form-group" style={{ width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label htmlFor="cardNumber" style={{ fontSize: 12, marginBottom: 2 }}>Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={fields.cardNumber || ''}
                      onChange={handleFieldChange}
                      style={{ fontSize: 13, padding: '6px 8px', width: '100%', minWidth: 120, maxWidth: 200, margin: '0 auto', display: 'block' }}
                    />
                    {errors.cardNumber && <div className="form-error">{errors.cardNumber}</div>}
                  </div>
                  <div className="form-row" style={{ gap: 8, width: '80%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                    <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <label htmlFor="expiry" style={{ fontSize: 12, marginBottom: 2 }}>Expiry Date</label>
                      <input 
                        type="text"
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={fields.expiry || ''}
                        onChange={handleFieldChange}
                        style={{ fontSize: 13, padding: '6px 8px', width: '100%', minWidth: 60, maxWidth: 100 }}
                      />
                      {errors.expiry && <div className="form-error">{errors.expiry}</div>}
                    </div>
                    <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <label htmlFor="cvv" style={{ fontSize: 12, marginBottom: 2 }}>CVV</label>
                      <input 
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={fields.cvv || ''}
                        onChange={handleFieldChange}
                        style={{ fontSize: 13, padding: '6px 8px', width: '100%', minWidth: 40, maxWidth: 80 }}
                      />
                      {errors.cvv && <div className="form-error">{errors.cvv}</div>}
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="bank-payment" style={{ padding: 8, width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label htmlFor="bank" style={{ fontSize: 12, marginBottom: 2 }}>Select your bank to proceed</label>
                  <select
                    id="bank"
                    name="bank"
                    value={fields.bank || ''}
                    onChange={handleFieldChange}
                    style={{ fontSize: 13, padding: '6px 8px', width: '100%', minWidth: 120, maxWidth: 200, margin: '0 auto', display: 'block' }}
                  >
                    <option value="">Select your bank</option>
                    <option value="bank1">Bank of America</option>
                    <option value="bank2">Chase Bank</option>
                    <option value="bank3">Wells Fargo</option>
                    <option value="bank4">Citibank</option>
                  </select>
                  {errors.bank && <div className="form-error">{errors.bank}</div>}
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="upi-payment" style={{ padding: 8, width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="qr-container" style={{ padding: 10 }}>
                    <div className="qr-code"></div>
                  </div>
                  <p style={{ fontSize: 12 }}>Scan this QR code with your UPI app</p>
                  <div className="form-group" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <label htmlFor="upi" style={{ fontSize: 12, marginBottom: 2 }}>UPI ID</label>
                    <input 
                      type="text"
                      id="upi"
                      name="upi"
                      placeholder="yourname@upi"
                      value={fields.upi || ''}
                      onChange={handleFieldChange}
                      style={{ fontSize: 13, padding: '6px 8px', width: '100%', minWidth: 100, maxWidth: 180, margin: '0 auto', display: 'block' }}
                    />
                    {errors.upi && <div className="form-error">{errors.upi}</div>}
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="wallet-payment" style={{ padding: 8, width: '80%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label style={{ fontSize: 12, marginBottom: 6, alignSelf: 'flex-start' }}>Select your digital wallet</label>
                  <div className="wallet-options" style={{ gap: 6, display: 'flex', justifyContent: 'center' }}>
                    <div
                      className={`wallet-option${fields.wallet === 'PayPal' ? ' selected' : ''}`}
                      style={{ fontSize: 13, padding: 8, minWidth: 60 }}
                      onClick={() => handleWalletSelect('PayPal')}
                    >
                      <p>PayPal</p>
                    </div>
                    <div
                      className={`wallet-option${fields.wallet === 'Apple Pay' ? ' selected' : ''}`}
                      style={{ fontSize: 13, padding: 8, minWidth: 60 }}
                      onClick={() => handleWalletSelect('Apple Pay')}
                    >
                      <p>Apple Pay</p>
                    </div>
                    <div
                      className={`wallet-option${fields.wallet === 'Google Pay' ? ' selected' : ''}`}
                      style={{ fontSize: 13, padding: 8, minWidth: 60 }}
                      onClick={() => handleWalletSelect('Google Pay')}
                    >
                      <p>Google Pay</p>
                    </div>
                  </div>
                  {errors.wallet && <div className="form-error">{errors.wallet}</div>}
                </div>
              )}

              {/* Terms and conditions */}
              <div className="terms-container" style={{ marginBottom: 10, width: '80%', margin: '0 auto' }}>
                <label className="checkbox-container" style={{ fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => {
                      setAgreed(e.target.checked);
                      setErrors({ ...errors, agreed: undefined });
                    }}
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
                </label>
                {errors.agreed && <div className="form-error">{errors.agreed}</div>}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-2" style={{ alignItems: 'center', width: '80%', margin: '0 auto' }}>
                <button
                  type="submit"
                  className="py-1 px-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 ease-in-out"
                  style={{ width: '100%', maxWidth: 220 }}
                >
                  Pay Now
                </button>
                <button
                  type="button"
                  className="py-1 px-2 bg-gray-300 text-gray-800 rounded-lg font-medium shadow-md hover:bg-gray-400 transition-all duration-200 ease-in-out"
                  onClick={() => navigate('/')}
                  style={{ width: '100%', maxWidth: 220 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;