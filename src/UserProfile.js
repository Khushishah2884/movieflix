import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    number: '',
    savedMovies: [],
    plan: { type: '', expiry: '' },
    devices: []
  });
  const [savedMovieDetails, setSavedMovieDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from backend (MongoDB movieeflix database)
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        // Fetch user profile from backend (movieeflix database)
        const res = await fetch('http://localhost:2001/api/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        setUser({
          name: data.name || '',
          email: data.email || '',
          number: data.number || '',
          plan: data.plan && typeof data.plan === 'object'
            ? { type: data.plan.type || '', expiry: data.plan.expiry || '' }
            : { type: '', expiry: '' },
          savedMovies: Array.isArray(data.savedMovies) ? data.savedMovies : [],
          devices: Array.isArray(data.devices) ? data.devices : []
        });

        // Fetch saved movies from backend Saved table (movieeflix database)
        const savedRes = await fetch('http://localhost:2001/api/saved-movies', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        let savedMoviesFromDb = [];
        if (savedRes.ok) {
          savedMoviesFromDb = await savedRes.json();
        }
        setSavedMovieDetails(savedMoviesFromDb || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="home-container" style={{ minHeight: '100vh', background: '#181828', padding: '2rem 0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: '#181828', padding: '2rem 0' }}>
      <div style={{
        maxWidth: 1000,
        margin: '2rem auto',
        background: '#23243a',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(255,77,77,0.13), 0 1.5px 8px rgba(97,218,251,0.08)',
        padding: '8rem',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffca28',
            fontSize: '2rem',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            marginBottom: 18
          }}
          aria-label="Back"
        >
          ←
        </button>
        {/* Print user name and email at the top */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{user.name}</div>
          <div style={{ fontSize: '1.2rem', color: '#61dafb' }}>{user.email}</div>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 18, color: '#ffca28' }}>My Profile</h2>
        <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <h3 style={{ color: '#61dafb', marginBottom: 8, textAlign: 'center' }}>User Details</h3>
            <div style={{ background: '#292a3a', borderRadius: 10, padding: '1rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Phone Number:</strong> {user.number}</div>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <h3 style={{ color: '#61dafb', marginBottom: 8 }}>Saved Movies</h3>
          {(!savedMovieDetails || savedMovieDetails.length === 0) && <div style={{ color: '#bbb' }}>No movies saved for later.</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {savedMovieDetails && savedMovieDetails.map(movie => (
              <div
                key={movie.imdbID}
                style={{
                  background: '#181828',
                  borderRadius: 10,
                  padding: '0.7rem',
                  width: 120,
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/movie/${movie.imdbID}`)}
              >
                <img
                  src={movie.moviePoster && movie.moviePoster !== 'N/A' ? movie.moviePoster : 'https://via.placeholder.com/100x150?text=No+Image'}
                  alt={movie.movieTitle || movie.imdbID}
                  style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                />
                <div style={{ color: '#ffca28', fontWeight: 600, fontSize: 13 }}>{movie.movieTitle || movie.imdbID}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
