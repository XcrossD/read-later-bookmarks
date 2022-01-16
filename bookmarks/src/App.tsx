import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import Sidebar from './components/sidebar';
import OriginalBookmarks from './components/original-bookmarks';

function App() {
  return (
    <div className="App">
      <div className="columns">
        <Sidebar />
        <OriginalBookmarks />
      </div>
    </div>
  );
}

export default App;
