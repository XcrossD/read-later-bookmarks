import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import {
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  ControlGroup,
  InputGroup,
  Alignment,
  Classes,
  Menu,
  MenuItem
} from '@blueprintjs/core';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';
import ControlBar from './components/controlbar';
import Bookmarks from './components/bookmarks';

let readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null = null;

function App() {
  const [newestFirst, setNewestFirst] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<Array<chrome.bookmarks.BookmarkTreeNode>>([]);

  useEffect(() => {
    const findOrCreateReadLaterFolder = async () => {
      const readLaterFolderSearchResult = await chrome.bookmarks.search("Read Later Bookmarks");
      let readLaterFolder = null;
      if (readLaterFolderSearchResult.length > 0) {
        readLaterFolder = readLaterFolderSearchResult[0];
      } else {
        readLaterFolder = await chrome.bookmarks.create({ title: "Read Later Bookmarks" });
      }
      return readLaterFolder
    };

    const getBookmarks = async (folderId: string) => {
      const folderChildrenResult = await chrome.bookmarks.getChildren(folderId);
      console.log(folderChildrenResult);
      setBookmarks(folderChildrenResult);
    }
    findOrCreateReadLaterFolder()
      .then(res => {
        readLaterFolder = res;
        getBookmarks(readLaterFolder.id);
      })
      .catch(console.error)
  }, []);
  
  return (
    <div className="App">
      <div className="container">
        <ControlBar
          newestFirst={newestFirst}
          setNewestFirst={setNewestFirst}
          readLaterFolder={readLaterFolder}
        />
        <Bookmarks
          readLaterFolder={readLaterFolder}
          bookmarks={bookmarks}
        />
      </div>
    </div>
  );
}

export default App;
