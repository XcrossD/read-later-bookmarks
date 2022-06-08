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
// import Bookmarks from './components/bookmarks';
import Bookmarks from './features/bookmarks/bookmarks';
import Nav from './components/navbar';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchreadLaterFolder, selectReadLaterFolder } from './features/readLaterFolder/readLaterFolderSlice';
import { fetchBookmarks, selectAllBookmarks } from './features/bookmarks/bookmarksSlice';
// import { IOptions, DEFAULT_SETTINGS } from '../../options/src/App';

// need to find a way to make single source of truth
export type IOptions = {
  [key: string]: any;
  defaultArchiveId: string;
  openBookmarkInNewTab: boolean;
  actionOnBookmarkClicked: string;
};

export const DEFAULT_SETTINGS = {
  defaultArchiveId: '1',
  openBookmarkInNewTab: false,
  actionOnBookmarkClicked: 'none'
};

let readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null = null;

function App() {
  const dispatch = useAppDispatch();
  const bookmarksStatus = useAppSelector(state => state.bookmarks.status);
  const bookmarks = useAppSelector(selectAllBookmarks);
  const readLaterFolderStatus = useAppSelector(state => state.readLaterFolder.status);
  const [newestFirst, setNewestFirst] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  // const [bookmarks, setBookmarks] = useState<Array<chrome.bookmarks.BookmarkTreeNode>>([]);
  const [options, setOptions] = useState<IOptions | null>(null);
  const [bulkEdit, setBulkEdit] = useState<boolean>(false);

  const toaster = useRef(null);

  // const refreshBookmarks = () => {
  //   const getBookmarks = async (folderId: string) => {
  //     let folderChildrenResult = await chrome.bookmarks.getChildren(folderId);
  //     folderChildrenResult.sort((a, b) => newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
  //     if (searchKeyword.length > 0) {
  //       folderChildrenResult = folderChildrenResult.filter((elem) => {
  //         return elem.title.toLowerCase().includes(searchKeyword) ||
  //           elem.url?.toLowerCase().includes(searchKeyword);
  //       });
  //     }
  //     // console.log(folderChildrenResult);
  //     setBookmarks(folderChildrenResult);
  //   };
  //   if (readLaterFolder) {
  //     getBookmarks(readLaterFolder.id);
  //   }
  // };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const handleSearchClear = () => {
    setSearchKeyword('');
  };

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

  // useEffect(() => {
  //   const findOrCreateReadLaterFolder = async () => {
  //     const readLaterFolderSearchResult = await chrome.bookmarks.search("Read Later Bookmarks");
  //     let readLaterFolder = null;
  //     if (readLaterFolderSearchResult.length > 0) {
  //       readLaterFolder = readLaterFolderSearchResult[0];
  //     } else {
  //       readLaterFolder = await chrome.bookmarks.create({ title: "Read Later Bookmarks" });
  //     }
  //     return readLaterFolder
  //   };

  //   findOrCreateReadLaterFolder()
  //     .then(res => {
  //       readLaterFolder = res;
  //       refreshBookmarks();
  //     })
  //     .catch(console.error);

  //   chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (result) => {
  //     setOptions({...result} as IOptions);
  //   });

  //   chrome.bookmarks.onChanged.addListener(() => {
  //     console.log("chrome.bookmarks.onChanged fired");
  //     refreshBookmarks();
  //   });
  //   chrome.bookmarks.onChildrenReordered.addListener(() => {
  //     console.log("chrome.bookmarks.onChildrenReordered fired");
  //     refreshBookmarks();
  //   });
  //   chrome.bookmarks.onCreated.addListener(() => {
  //     console.log("chrome.bookmarks.onCreated fired");
  //     refreshBookmarks();
  //   });
  //   chrome.bookmarks.onMoved.addListener(() => {
  //     console.log("chrome.bookmarks.onMoved fired");
  //     refreshBookmarks();
  //   });
  //   chrome.bookmarks.onRemoved.addListener(() => {
  //     console.log("chrome.bookmarks.onRemoved fired");
  //     refreshBookmarks();
  //   });
  // }, []);

  // useEffect(() => {
  //   refreshBookmarks();
  // }, [newestFirst, searchKeyword]);

  useEffect(() => {
    if (readLaterFolderStatus === 'idle') {
      dispatch(fetchreadLaterFolder());
    }
  }, [readLaterFolderStatus, dispatch]);

  useEffect(() => {
    if (bookmarksStatus === 'idle' && readLaterFolderStatus === 'succeeded') {
      dispatch(fetchBookmarks());
    }
  }, [bookmarksStatus, readLaterFolderStatus, dispatch])

  // useEffect(() => {
  //   const handleStorageChange = (changes: object) => {
  //     chrome.storage.onChanged.removeListener(handleStorageChange);
  //     if (options) {
  //       const newOptions = {...options} as IOptions;
  //       for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
  //         newOptions[key] = newValue;
  //       }
  //       setOptions(newOptions);
  //     }
  //   };

  //   chrome.storage.onChanged.addListener(handleStorageChange);
  // }, [options]);

  return (
    <div className="App">
      <div className="container">
        <Nav
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          newestFirst={newestFirst}
          setNewestFirst={setNewestFirst}
          bulkEdit={bulkEdit}
          setBulkEdit={setBulkEdit}
          toaster={toaster.current}
        />
        <Bookmarks
          // readLaterFolder={readLaterFolder}
          searchKeyword={searchKeyword}
          // bookmarks={bookmarks}
          // setBookmarks={setBookmarks}
          // refreshBookmarks={refreshBookmarks}
          toaster={toaster.current}
          options={options}
        />
      </div>
      <Toaster position={Position.BOTTOM_LEFT} ref={toaster} />
    </div>
  );
}

export default App;
