import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from './components/sidebar';
import Bookmarks from './components/bookmarks';
import OriginalBookmarks from './components/original-bookmarks';
import {TrieTree} from './data/trie';

function App() {
  const [tree, setTree] = useState<null|TrieTree>(null);
  const [activeFolderId, setActiveFolderId] = useState<string>("1");

  useEffect(() => {
    const fetchTreeData = async () => {
      const treeArr = await chrome.bookmarks.getTree();
      const trie = new TrieTree();
      trie.populate(treeArr);
      console.log("treeArr", treeArr);
      console.log("trie", trie);
      setTree(trie);
    };
    fetchTreeData()
      .catch(console.error);
  }, []);

  const handleFolderChange = (nodeId: string) => {
    setActiveFolderId(nodeId);
  }
  
  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Sidebar
              data={tree}
              activeFolderId={activeFolderId}
              handleFolderChange={handleFolderChange}
            />
          </Grid>
          <Grid item xs={8}>
            <Bookmarks
              data={tree}
              activeFolderId={activeFolderId}
            />
          </Grid>
          <Grid item xs={2}>

          </Grid>
        </Grid>
        
        {/* <OriginalBookmarks
          data={tree}
          activeFolderId={activeFolderId}
          handleFolderChange={handleFolderChange}
        /> */}
      </Box>
    </div>
  );
}

export default App;
