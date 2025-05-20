import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import Subscribe from './Subscribe';
import Payment from './Payment';
import MovieDetails from './MovieDetails';
import UserProfile from './UserProfile';
import Movies from './Movies';
import TVShows from './TVShows';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/movie/:imdbID" element={<MovieDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<TVShows />} />
      
      </Routes>
    </Router>
  );
}

export default App;
