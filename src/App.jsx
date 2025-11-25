// src/App.jsx
import React, { useState, useEffect } from 'react';
import { SearchInput } from './components/SearchInput';
import { SearchResults } from './components/SearchResults';
import { UserDetails } from './components/UserDetails';
import { searchUsers } from './api/githubService';

const HISTORY_STORAGE_KEY = 'githubSearchHistory';
const HISTORY_MAX_ITEMS = 5;

function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserLogin, setSelectedUserLogin] = useState(null);

  const [history, setHistory] = useState([]);


  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Could not load history from localStorage:", e);
    }
  }, []); 
  const handleSearchTrigger = (newQuery) => {
    if (!newQuery.trim()) return;

    if (newQuery !== query) {
      setQuery(newQuery);
      setCurrentPage(1); 
      setSelectedUserLogin(null); 
    }
  };

  const handlePageChange = (page) => {
    if (query) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await searchUsers(query, currentPage);
        setResults(data);

        setHistory(prevHistory => {
          const newHistory = prevHistory.filter(term => term !== query);
          const updatedHistory = [query, ...newHistory].slice(0, HISTORY_MAX_ITEMS);
          
          try {
              localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
          } catch (e) {
              console.error("Could not save history to localStorage:", e);
          }
          
          return updatedHistory;
        });
        
      } catch (err) {
        setError(err.message);
        setResults({ items: [], total_count: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);


  const handleSelectUser = (login) => {
    setSelectedUserLogin(login);
  };
  

  const sidebarContent = (
    <>
      <SearchInput 
        onSearch={handleSearchTrigger} 
        initialQuery={query} 
      />
      
      <SearchResults
        results={results}
        loading={loading}
        error={error}
        query={query}
        currentPage={currentPage}
        totalCount={results?.total_count || 0}
        onPageChange={handlePageChange}
        onSelectUser={handleSelectUser}
        selectedUserLogin={selectedUserLogin}
        history={history}
        onSearchTrigger={handleSearchTrigger}
      />
    </>
  );

  const panelContent = (
    <>
      <h1>User Details</h1>
      <UserDetails selectedUserLogin={selectedUserLogin} />
    </>
  );

  return (
    <div className="app-container">
      <aside className="sidebar">
        {sidebarContent}
      </aside>
      <main className="main-panel">
        {panelContent}
      </main>
    </div>
  );
}

export default App;