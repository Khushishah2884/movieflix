import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'b5382e81';

function TVShows() {
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState('Friends');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShows(search);
    // eslint-disable-next-line
  }, []);

  const fetchShows = async (query) => {
    setLoading(true);
    const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=series`);
    const data = await res.json();
    if (data.Search) {
      const detailed = await Promise.all(
        data.Search.slice(0, 12).map(async s => {
          const detailRes = await fetch(`${API_URL}?apikey=${API_KEY}&i=${s.imdbID}`);
          return await detailRes.json();
        })
      );
      setShows(detailed);
    } else {
      setShows([]);
    }
    setLoading(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchShows(search);
  };

  const handlePosterClick = (imdbID) => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Not logged in: redirect to login, then to home after login
      navigate('/login', { replace: true, state: { from: '/series' } });
    } else {
      navigate(`/movie/${imdbID}`);
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: '#181828', padding: '2rem 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ color: '#61dafb', fontSize: '2.2rem', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
          Explore TV Shows
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Search TV shows..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: 8,
              border: 'none',
              fontSize: 18,
              width: 320,
              marginRight: 12,
              background: '#23243a',
              color: '#fff'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #61dafb 60%, #ffca28 100%)',
              color: '#23243a',
              border: 'none',
              borderRadius: 8,
              padding: '0.8rem 2rem',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>
        {loading ? (
          <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center'
          }}>
            {shows.length === 0 && (
              <div style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No TV shows found.</div>
            )}
            {shows.map(show => (
              <div
                key={show.imdbID}
                style={{
                  background: '#23243a',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(97,218,251,0.13)',
                  width: 220,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => handlePosterClick(show.imdbID)}
              >
                <img
                  src={show.Poster !== 'N/A' ? show.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}
                  alt={show.Title}
                  style={{
                    width: 160,
                    height: 240,
                    objectFit: 'cover',
                    borderRadius: 10,
                    marginBottom: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                  }}
                />
                <div style={{ color: '#61dafb', fontWeight: 700, fontSize: 18, marginBottom: 6, textAlign: 'center' }}>{show.Title}</div>
                <div style={{ color: '#bbb', fontSize: 15, marginBottom: 4 }}>{show.Year}</div>
                <div style={{ color: '#ffca28', fontSize: 14 }}>{show.Genre}</div>
                <div style={{ color: '#fff', fontSize: 15, marginTop: 6 }}>
                  <span role="img" aria-label="star">⭐</span> {show.imdbRating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TVShows;
