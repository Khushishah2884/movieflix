import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.css';

const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'b5382e81';

function MovieDetails() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      const res = await fetch(`${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    }
    fetchMovie();
  }, [imdbID]);

  if (loading) {
    return <div className="home-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff' }}>Loading...</span></div>;
  }

  if (!movie || movie.Response === 'False') {
    return <div className="home-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff' }}>Movie not found.</span></div>;
  }

  return (
    <div className="home-container" style={{ minHeight: '100vh', background: '#181828', padding: '2rem 0' }}>
      <div style={{
        maxWidth: 600,
        margin: '2rem auto',
        background: '#23243a',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(255,77,77,0.13), 0 1.5px 8px rgba(97,218,251,0.08)',
        padding: '2rem',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.Title}
          style={{
            width: 220,
            height: 320,
            objectFit: 'cover',
            borderRadius: 12,
            marginBottom: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
          }}
        />
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, textAlign: 'center', color: '#ffca28' }}>{movie.Title}</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem', justifyContent: 'center' }}>
          <button
            style={{
              background: 'linear-gradient(90deg, #ff4d4d 60%, #ff007c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 30,
              padding: '0.6rem 1.5rem',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: 8
            }}
            onClick={() => window.open(`https://www.imdb.com/title/${movie.imdbID}`, '_blank')}
          >
            Watch Now
          </button>
          <button
            style={{
              background: '#292a3a',
              color: '#ffca28',
              border: '1.5px solid #ffca28',
              borderRadius: 30,
              padding: '0.6rem 1.5rem',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer'
            }}
            onClick={async () => {
              // Save for later logic (localStorage)
              const saved = JSON.parse(localStorage.getItem('savedMovies') || '[]');
              if (!saved.find(m => m === movie.imdbID)) {
                saved.push(movie.imdbID);
                localStorage.setItem('savedMovies', JSON.stringify(saved));
                // Save to backend if logged in
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const token = localStorage.getItem('token');
                if (user && user.email && token) {
                  try {
                    const resp = await fetch('http://localhost:2001/api/save-movie', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        imdbID: movie.imdbID,
                        movieTitle: movie.Title,
                        moviePoster: movie.Poster
                      })
                    });
                    console.log(resp);
                  } catch (e) {
                    // ignore backend error, still saved locally
                  }
                }
                alert('Saved for later!');
              } else {
                alert('Already saved!');
              }
            }}
          >
            Save for Later
          </button>
        </div>
        <div style={{ width: '100%', marginBottom: '1.2rem', color: '#bbb', fontSize: '1.05rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#fff' }}>Summary:</strong> {movie.Plot}
        </div>
        <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '1.2rem', marginBottom: '0.5rem', color: '#eee', fontSize: '1rem' }}>
          <div><strong>Year:</strong> {movie.Year}</div>
          <div><strong>Actors:</strong> {movie.Actors}</div>
          <div><strong>Genre:</strong> {movie.Genre}</div>
          <div><strong>Type:</strong> {movie.Type}</div>
          <div><strong>IMDB Rating:</strong> {movie.imdbRating}</div>
        </div>
        <button
          style={{
            marginTop: '1.5rem',
            background: 'none',
            color: '#61dafb',
            border: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default MovieDetails;
