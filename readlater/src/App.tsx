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
  const [newestFirst, setNewestFirst] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Array<chrome.bookmarks.BookmarkTreeNode>>([]);

  const refreshBookmarks = () => {
    const getBookmarks = async (folderId: string) => {
      const folderChildrenResult = await chrome.bookmarks.getChildren(folderId);
      console.log(folderChildrenResult);
      setBookmarks(folderChildrenResult);
    };
    if (readLaterFolder) {
      getBookmarks(readLaterFolder.id);
    }
  };

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

    findOrCreateReadLaterFolder()
      .then(res => {
        readLaterFolder = res;
        refreshBookmarks();
      })
      .catch(console.error);

      chrome.bookmarks.onChanged.addListener(() => {
        console.log("chrome.bookmarks.onChanged fired");
        refreshBookmarks();
      });
      chrome.bookmarks.onChildrenReordered.addListener(() => {
        console.log("chrome.bookmarks.onChildrenReordered fired");
        refreshBookmarks();
      });
      chrome.bookmarks.onCreated.addListener(() => {
        console.log("chrome.bookmarks.onCreated fired");
        refreshBookmarks();
      });
      chrome.bookmarks.onMoved.addListener(() => {
        console.log("chrome.bookmarks.onMoved fired");
        refreshBookmarks();
      });
      chrome.bookmarks.onRemoved.addListener(() => {
        console.log("chrome.bookmarks.onRemoved fired");
        refreshBookmarks();
      });
  }, []);

  useEffect(() => {
    const newBookmarks = [...bookmarks];
    newBookmarks.sort((a, b) => newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
    setBookmarks(newBookmarks);
  }, [newestFirst]);

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
          setBookmarks={setBookmarks}
          refreshBookmarks={refreshBookmarks}
        />
      </div>
    </div>
  );
}

export default App;
