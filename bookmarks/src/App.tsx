import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import Sidebar from './components/sidebar';
import OriginalBookmarks from './components/original-bookmarks';
import {TrieTree} from './data/trie';

function App() {
  const [tree, setTree] = useState<null|TrieTree>(null);

  useEffect(() => {
    chrome.bookmarks.getTree((treeArr) => {
      const trie = new TrieTree();
      trie.populate(treeArr);
      setTree(trie);
    });
  });
  
  return (
    <div className="App">
      <div className="columns">
        <Sidebar />
        <OriginalBookmarks data={tree} />
      </div>
    </div>
  );
}

export default App;
