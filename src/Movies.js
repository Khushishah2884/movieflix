import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'b5382e81';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('Avengers');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies(search);
    // eslint-disable-next-line
  }, []);

  const fetchMovies = async (query) => {
    setLoading(true);
    const res = await fetch(`${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();
    if (data.Search) {
      const detailed = await Promise.all(
        data.Search.slice(0, 12).map(async m => {
          const detailRes = await fetch(`${API_URL}?apikey=${API_KEY}&i=${m.imdbID}`);
          return await detailRes.json();
        })
      );
      setMovies(detailed);
    } else {
      setMovies([]);
    }
    setLoading(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchMovies(search);
  };

  const handlePosterClick = (imdbID) => {
    const user = localStorage.getItem('user');
    if (!user) {
      // Not logged in: redirect to login, then to home after login
      navigate('/login', { replace: true, state: { from: '/movies' } });
    } else {
      navigate(`/movie/${imdbID}`);
    }
  };

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: '#181828', padding: '2rem 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ color: '#ffca28', fontSize: '2.2rem', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
          Explore Movies
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Search movies..."
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
              background: 'linear-gradient(90deg, #ff4d4d 60%, #ffca28 100%)',
              color: '#fff',
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
            {movies.length === 0 && (
              <div style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No movies found.</div>
            )}
            {movies.map(movie => (
              <div
                key={movie.imdbID}
                style={{
                  background: '#23243a',
                  borderRadius: 16,
                  boxShadow: '0 4px 16px rgba(255,77,77,0.13)',
                  width: 220,
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => handlePosterClick(movie.imdbID)}
              >
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}
                  alt={movie.Title}
                  style={{
                    width: 160,
                    height: 240,
                    objectFit: 'cover',
                    borderRadius: 10,
                    marginBottom: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
                  }}
                />
                <div style={{ color: '#ffca28', fontWeight: 700, fontSize: 18, marginBottom: 6, textAlign: 'center' }}>{movie.Title}</div>
                <div style={{ color: '#bbb', fontSize: 15, marginBottom: 4 }}>{movie.Year}</div>
                <div style={{ color: '#61dafb', fontSize: 14 }}>{movie.Genre}</div>
                <div style={{ color: '#fff', fontSize: 15, marginTop: 6 }}>
                  <span role="img" aria-label="star">⭐</span> {movie.imdbRating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;
