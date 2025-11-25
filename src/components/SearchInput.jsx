import React, { useState, useEffect } from 'react';

export function SearchInput({ onSearch, initialQuery }) {
  const [input, setInput] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  useEffect(() => {
    setInput(initialQuery);
  }, [initialQuery]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub username..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={!input.trim()}>
          Search
        </button>
      </div>
    </form>
  );
}