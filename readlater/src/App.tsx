import React, { useState, useEffect, useRef } from 'react';
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
  MenuItem,
  Toaster,
  Position,
} from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import './App.css';
import Bookmarks from './components/bookmarks';

let readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null = null;

function App() {
  const [newestFirst, setNewestFirst] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<Array<chrome.bookmarks.BookmarkTreeNode>>([]);

  const toaster = useRef(null);

  const refreshBookmarks = () => {
    const getBookmarks = async (folderId: string) => {
      let folderChildrenResult = await chrome.bookmarks.getChildren(folderId);
      folderChildrenResult.sort((a, b) => newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
      if (searchKeyword.length > 0) {
        folderChildrenResult = folderChildrenResult.filter((elem) => {
          return elem.title.toLowerCase().includes(searchKeyword) ||
            elem.url?.toLowerCase().includes(searchKeyword);
        });
      }
      console.log(folderChildrenResult);
      setBookmarks(folderChildrenResult);
    };
    if (readLaterFolder) {
      getBookmarks(readLaterFolder.id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const handleSearchClear = () => {
    setSearchKeyword('');
  }

  const sortMenu = (
    <Menu>
      <MenuItem icon="sort-asc" text="Oldest first" onClick={() => setNewestFirst(false)}/>
      <MenuItem icon="sort-desc" text="Newest first" onClick={() => setNewestFirst(true)}/>
    </Menu>
  );

  const searchClear = (
    <Button
      className={Classes.MINIMAL}
      icon="cross"
      onClick={handleSearchClear}
      minimal
    />
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
    refreshBookmarks();
  }, [newestFirst, searchKeyword]);

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
                  onChange={handleSearchChange}
                  rightElement={searchKeyword.length > 0 ? searchClear : undefined}
                  value={searchKeyword}
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
          toaster={toaster.current}
        />
      </div>
      <Toaster position={Position.BOTTOM_LEFT} ref={toaster} />
    </div>
  );
}

export default App;
