import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'b5382e81'; 

const suggestedTitles = [
  'Avengers',
  'Inception',
  'Titanic',
  'Joker',
  'Interstellar'
];

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('user'));
    fetchSuggestedMovies();
  }, []);

  // Fetch suggested movies and extract available categories from them
  const fetchSuggestedMovies = async () => {
    setLoading(true);
    const results = [];
    const genreSet = new Set();
    for (const title of suggestedTitles) {
      const res = await fetch(`${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data && data.Response !== 'False') {
        results.push(data);
        if (data.Genre) {
          data.Genre.split(',').map(g => genreSet.add(g.trim()));
        }
      }
    }
    setMovies(results);
    setCategories(Array.from(genreSet));
    setLoading(false);
  };

  // Fetch movies from OMDb API
  const fetchMovies = async (query = 'Avengers', genre) => {
    setLoading(true);
    let url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    let movieList = data.Search || [];
    if (genre && movieList.length) {
      const filtered = [];
      for (const m of movieList) {
        const detailRes = await fetch(`${API_URL}?apikey=${API_KEY}&i=${m.imdbID}`);
        const detail = await detailRes.json();
        if (detail.Genre && detail.Genre.includes(genre)) {
          filtered.push(detail);
        }
      }
      setMovies(filtered);
    } else if (movieList.length) {
      const detailed = await Promise.all(
        movieList.slice(0, 8).map(async m => {
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
    fetchMovies(search, category);
  };

  const handleCategory = cat => {
    setCategory(cat);
    fetchMovies(search || 'Avengers', cat);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-container">
          <div className="logo-container">
            <h1 className="logo">movieflix</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="/" className="nav-link active">Home</a>
            <a href="/movies" className="nav-link">Movies</a>
            <a href="/series" className="nav-link">TV Shows</a>
          </nav>

          {/* User Controls */}
          <div className="user-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search movies..."
                className="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {!isLoggedIn && (
                <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
              )}
              <button
                className="subscribe-btn"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate('/login');
                  } else {
                    navigate('/subscribe');
                  }
                }}
              >
                Subscribe Now
              </button>
              {isLoggedIn && (
                <>
                  <button className="login-btn" onClick={handleLogout}>Logout</button>
                  <button
                    className="profile-btn"
                    style={{
                      background: 'none',
                      border: 'none',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      marginLeft: 4,
                      padding: 0
                    }}
                    title="Profile"
                    onClick={() => navigate('/profile')}
                  >
                    <svg width="26" height="26" fill="none" stroke="#ffca28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="/" className="nav-link active">Home</a>
            <a href="/movies" className="nav-link">Movies</a>
            <a href="/series" className="nav-link">TV Shows</a>
            {isLoggedIn && (
              <a href="/profile" className="nav-link">Profile</a>
            )}
          </nav>
          <div className="mobile-search">
            <input
              type="text"
              placeholder="Search movies..."
              className="search-input"
            />
            <button className="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          <button className="login-btn mobile-login">Sign In</button>
        </div>
      </header>

      <main className="home-main">
        <div className="categories-section">
          <div className="categories-container">
            <span style={{ fontWeight: 600, color: "#ff4d4d", marginRight: "1rem", fontSize: "1.1rem" }}>
              Filter by Genre:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-item${category === cat ? ' active' : ''}`}
                onClick={() => handleCategory(cat)}
                style={{ cursor: 'pointer', border: 'none', background: 'none' }}
              >
                {cat}
              </button>
            ))}
            {category && (
              <button
                className="category-item"
                style={{ background: '#ff4d4d', color: '#fff', marginLeft: '1rem' }}
                onClick={() => { setCategory(''); fetchMovies(search || 'Avengers'); }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
        <section className="featured-section">
          <h2 className="section-title">Featured Movies</h2>
          {loading ? (
            <div style={{ color: '#fff', textAlign: 'center' }}>Loading...</div>
          ) : (
            <div className="movies-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
              {movies.length === 0 && (
                <div style={{ color: '#fff', textAlign: 'center', width: '100%' }}>No movies found.</div>
              )}
              {movies.map(movie => (
                <div
                  className="movie-card"
                  key={movie.imdbID}
                  style={{ minWidth: 220, maxWidth: 240, flex: '1 1 220px', cursor: 'pointer' }}
                  onClick={() => {
                    if (!localStorage.getItem('user')) {
                      // Not logged in: redirect to login
                      navigate('/login', { replace: true, state: { from: '/' } });
                    } else {
                      navigate(`/movie/${movie.imdbID}`);
                    }
                  }}
                >
                  <div className="movie-poster">
                    <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'} alt={movie.Title} />
                  </div>
                  <div className="movie-info">
                    <div className="movie-title">{movie.Title}</div>
                    <div className="movie-genre">{movie.Genre}</div>
                    <div className="movie-rating">
                      <span role="img" aria-label="star">⭐</span>
                      {movie.imdbRating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2 className="logo">movieflix</h2>
            <p>Stream your favorite movies anytime, anywhere.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <a href="/about">About Us</a>
              <a href="https://www.linkedin.com/in/khushi-shah-679071252/">Contact</a>
              <a href="/careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="/faq">FAQ</a>
              <a href="/help">Help Center</a>
              <a href="/terms">Terms of Service</a>
            </div>
            <div className="footer-column">
              <h4>Social</h4>
              <a href="https://www.linkedin.com/in/khushi-shah-679071252/">linkedin</a>
              <a href="https://www.facebook.com/profile.php?id=61554822480246">Facebook</a>
              <a href="https://www.instagram.com/khushi__sh288/">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} movieflix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;