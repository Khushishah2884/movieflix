import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Subscribe() {
  const navigate = useNavigate();

  const handleChoosePlan = (plan) => {
    navigate('/payment', { state: { plan } });
  };

  return (
    <div className="home-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: 'rgba(15,15,30,0.97)',
        padding: '2.5rem 2rem',
        borderRadius: '20px',
        boxShadow: '0 6px 32px rgba(0,0,0,0.25)',
        textAlign: 'center',
        maxWidth: 900,
        width: '100%',
        margin: '2rem auto'
      }}>
        <h2 style={{ color: '#ffca28', marginBottom: '1.5rem', fontSize: '2.2rem', letterSpacing: 1 }}>Choose Your Plan</h2>
        <p style={{ color: '#fff', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Unlock unlimited movies and exclusive content with a MovieeFlix subscription!
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {/* Basic Plan */}
          <div style={{
            background: '#23243a',
            borderRadius: 16,
            padding: '2rem 1.5rem',
            color: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
            minWidth: 240,
            maxWidth: 300,
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>🎬</div>
            <h3 style={{ color: '#ffca28', marginBottom: 8, fontWeight: 700, fontSize: '1.3rem' }}>Basic</h3>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>₹99<span style={{ fontSize: 16 }}>/month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', textAlign: 'left', color: '#eee', fontSize: 15 }}>
              <li>• SD quality</li>
              <li>• 1 device</li>
              <li>• Cancel anytime</li>
            </ul>
            <button className="subscribe-btn" style={{ width: '100%' }} onClick={() => handleChoosePlan('Basic')}>Choose Basic</button>
          </div>
          {/* Standard Plan */}
          <div style={{
            background: 'linear-gradient(120deg, #23243a 60%, #61dafb 100%)',
            borderRadius: 16,
            padding: '2rem 1.5rem',
            color: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
            minWidth: 240,
            maxWidth: 300,
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            border: '2px solid #61dafb'
          }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>⭐</div>
            <h3 style={{ color: '#61dafb', marginBottom: 8, fontWeight: 700, fontSize: '1.3rem' }}>Standard</h3>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>₹299<span style={{ fontSize: 16 }}>/month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', textAlign: 'left', color: '#eee', fontSize: 15 }}>
              <li>• HD quality</li>
              <li>• 2 devices</li>
              <li>• Download & watch offline</li>
            </ul>
            <button className="subscribe-btn" style={{ width: '100%' }} onClick={() => handleChoosePlan('Standard')}>Choose Standard</button>
            <div style={{
              position: 'absolute',
              top: -18,
              right: 18,
              background: '#61dafb',
              color: '#23243a',
              fontWeight: 700,
              fontSize: 13,
              borderRadius: 12,
              padding: '0.2rem 0.8rem',
              boxShadow: '0 2px 8px rgba(97,218,251,0.18)'
            }}>Most Popular</div>
          </div>
          {/* Premium Plan */}
          <div style={{
            background: 'linear-gradient(120deg, #23243a 60%, #ff4d4d 100%)',
            borderRadius: 16,
            padding: '2rem 1.5rem',
            color: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
            minWidth: 240,
            maxWidth: 300,
            flex: '1 1 240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            border: '2px solid #ff4d4d'
          }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>👑</div>
            <h3 style={{ color: '#ff4d4d', marginBottom: 8, fontWeight: 700, fontSize: '1.3rem' }}>Premium</h3>
            <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>₹499<span style={{ fontSize: 16 }}>/month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', textAlign: 'left', color: '#eee', fontSize: 15 }}>
              <li>• Ultra HD</li>
              <li>• 4 devices</li>
              <li>• All features included</li>
            </ul>
            <button className="subscribe-btn" style={{ width: '100%' }} onClick={() => handleChoosePlan('Premium')}>Choose Premium</button>
            <div style={{
              position: 'absolute',
              top: -18,
              right: 18,
              background: '#ff4d4d',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              borderRadius: 12,
              padding: '0.2rem 0.8rem',
              boxShadow: '0 2px 8px rgba(255,77,77,0.18)'
            }}>Best Value</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
