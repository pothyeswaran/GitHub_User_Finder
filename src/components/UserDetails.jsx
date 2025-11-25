import React, { useState, useEffect } from 'react';
import { fetchUserDetails } from '../api/githubService';


function Loader() {
  return (
    <div className="loader-container">
      <span className="loader-text">Loading...</span>
    </div>
  );
}

function ErrorDisplay({ message }) {
  if (!message) return null;
  return (
    <div className="error-box">
      **Error:** {message}
    </div>
  );
}

export function UserDetails({ selectedUserLogin }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedUserLogin) {
      setDetails(null);
      setError(null);
      return;
    }

    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await fetchUserDetails(selectedUserLogin);
        setDetails(userData);
      } catch (err) {
        setError(err.message);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [selectedUserLogin]);

  if (!selectedUserLogin) {
    return (
      <div className="details-container">
        <p className="details-placeholder">
          Select a user from the search results to view their full profile.
        </p>
      </div>
    );
  }

  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;
  if (!details) return null;

  return (
    <div className="details-container">
      <div className="details-card">
        <img 
          src={details.avatar_url} 
          alt={details.login} 
          className="details-avatar" 
        />
        <h2 className="details-name">{details.name || details.login}</h2>
        <p className="details-login">@{details.login}</p>
        
        {details.bio && <p className="details-bio">{details.bio}</p>}
        {details.location && <p>**Location:** {details.location}</p>}

        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{details.public_repos?.toLocaleString() || 0}</span>
            <span className="stat-label">Public Repos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{details.followers?.toLocaleString() || 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{details.following?.toLocaleString() || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
        
        <a 
          href={details.html_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="details-link"
        >
          Go to GitHub Profile
        </a>
      </div>
    </div>
  );
}