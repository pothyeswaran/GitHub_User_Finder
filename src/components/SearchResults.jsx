import React from 'react';

const HISTORY_MAX_ITEMS = 5;

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

function SearchHistoryList({ history, onSearchTrigger }) {
  if (history.length === 0) return null;

  return (
    <div>
      <h3 className="history-header">
        Recent Searches ({HISTORY_MAX_ITEMS} max)
      </h3>
      <ul className="history-list">
        {history.map((term, index) => (
          <li 
            key={index} 
            className="history-item" 
            onClick={() => onSearchTrigger(term)}
          >
            <span className="history-term">{term}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchResultItem({ user, onSelect, isSelected }) {
  const itemClasses = `result-item ${isSelected ? 'selected' : ''}`;

  return (
    <li 
      className={itemClasses}
      onClick={() => onSelect(user.login)}
    >
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <div className="user-info">
        <p className="user-login">{user.login}</p>
        <a 
          href={user.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="profile-link"
          onClick={(e) => e.stopPropagation()}
        >
          View Profile
        </a>
      </div>
    </li>
  );
}

export function SearchResults({ 
  results, loading, error, query, 
  currentPage, totalCount, onPageChange,
  onSelectUser, selectedUserLogin, 
  history, onSearchTrigger
}) {
  if (loading) return <Loader />;
  if (error) return <ErrorDisplay message={error} />;

  const userItems = results?.items || [];
  
  if (!query) {
      return (
          <>
            <SearchHistoryList history={history} onSearchTrigger={onSearchTrigger} />
            <p className="empty-message">Start searching for GitHub users!</p>
          </>
      );
  }

  if (query && userItems.length === 0 && totalCount === 0) {
    return (
      <>
        <SearchHistoryList history={history} onSearchTrigger={onSearchTrigger} />
        <p className="error-message">No users found for "{query}".</p>
      </>
    );
  }

  const perPage = 10;
  const maxPages = Math.ceil(totalCount / perPage);
  const effectiveMaxPages = Math.min(maxPages, 100); 

  const handlePrev = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);

  return (
    <div>
      <SearchHistoryList history={history} onSearchTrigger={onSearchTrigger} />

      <h2 className="results-header">
        Search Results ({totalCount.toLocaleString()} total)
      </h2>
      
      <ul className="results-list">
        {userItems.map((user) => (
          <SearchResultItem
            key={user.id}
            user={user}
            onSelect={onSelectUser}
            isSelected={user.login === selectedUserLogin}
          />
        ))}
      </ul>

      {effectiveMaxPages > 1 && (
        <div className="pagination">
          <button 
            className="page-button"
            onClick={handlePrev} 
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {effectiveMaxPages}
          </span>

          <button 
            className="page-button"
            onClick={handleNext} 
            disabled={currentPage >= effectiveMaxPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}