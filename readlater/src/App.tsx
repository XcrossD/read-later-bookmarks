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
import { Popover2 } from "@blueprintjs/popover2";
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';
import Bookmarks from './components/bookmarks';

let readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null = null;

function App() {
  const [newestFirst, setNewestFirst] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Array<chrome.bookmarks.BookmarkTreeNode>>([]);

  const refreshBookmarks = () => {
    const getBookmarks = async (folderId: string) => {
      const folderChildrenResult = await chrome.bookmarks.getChildren(folderId);
      folderChildrenResult.sort((a, b) => newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
      console.log(folderChildrenResult);
      setBookmarks(folderChildrenResult);
    };
    if (readLaterFolder) {
      getBookmarks(readLaterFolder.id);
    }
  };

  const sortMenu = (
    <Menu>
      <MenuItem icon="sort-asc" text="Oldest first" onClick={() => setNewestFirst(false)}/>
      <MenuItem icon="sort-desc" text="Newest first" onClick={() => setNewestFirst(true)}/>
    </Menu>
  );

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
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Read Later Bookmarks</NavbarHeading>
            <ControlGroup>
              <InputGroup
                  leftIcon="search"
                  placeholder="Search bookmarks"
              />
            </ControlGroup>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            {/* <Button className={Classes.MINIMAL} icon="document" text="Tag" /> */}
            <Popover2 content={sortMenu} placement="auto">
              <Button className={Classes.MINIMAL} icon={newestFirst ? "sort-desc" : "sort-asc"} text="Sort" />
            </Popover2>
          </NavbarGroup>
        </Navbar>
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
