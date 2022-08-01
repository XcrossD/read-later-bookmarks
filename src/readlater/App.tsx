import React, { useState, useEffect, useRef } from 'react';
import {
  Toaster,
  Position,
} from '@blueprintjs/core';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import './App.scss';
import Bookmarks from './features/bookmarks/bookmarks';
import Nav from './components/navbar';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchreadLaterFolder } from './features/readLaterFolder/readLaterFolderSlice';
import { fetchBookmarks, selectAllBookmarks } from './features/bookmarks/bookmarksSlice';
import { fetchOptions } from './features/options/optionsSlice';
import BulkEditBookmarks from './features/bookmarks/bulkbookmarks';
import { DEFAULT_SETTINGS } from '../options/App';

function App() {
  const dispatch = useAppDispatch();
  const bookmarksStatus = useAppSelector(state => state.bookmarks.status);
  const bookmarks: Array<chrome.bookmarks.BookmarkTreeNode> = useAppSelector(selectAllBookmarks);
  const readLaterFolderStatus = useAppSelector(state => state.readLaterFolder.status);
  const optionsStatus = useAppSelector(state => state.options.status);
  const options = useAppSelector(state => state.options.options);
  const [newestFirst, setNewestFirst] = useState<boolean>(false);
  const [bulkEdit, setBulkEdit] = useState<boolean>(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<{ [key: string]: boolean }>({});
  const [optionsLoaded, setOptionsLoaded] = useState<boolean>(false);

  const toaster = useRef(null);

  useEffect(() => {
    chrome.bookmarks.onChanged.addListener(() => {
      console.log("chrome.bookmarks.onChanged fired");
      dispatch(fetchBookmarks());
    });
    chrome.bookmarks.onChildrenReordered.addListener(() => {
      console.log("chrome.bookmarks.onChildrenReordered fired");
      dispatch(fetchBookmarks());
    });
    chrome.bookmarks.onCreated.addListener(() => {
      console.log("chrome.bookmarks.onCreated fired");
      dispatch(fetchBookmarks());
    });
    chrome.bookmarks.onMoved.addListener(() => {
      console.log("chrome.bookmarks.onMoved fired");
      dispatch(fetchBookmarks());
    });
    chrome.bookmarks.onRemoved.addListener(() => {
      console.log("chrome.bookmarks.onRemoved fired");
      dispatch(fetchBookmarks());
    });
  }, [])

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

  useEffect(() => {
    const handleStorageChange = (changes: object) => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
      if (Object.keys(changes).some(key => key in DEFAULT_SETTINGS)) {
        dispatch(fetchOptions());
      }
    };
    
    if (optionsStatus === 'idle') {
      dispatch(fetchOptions());
    }
    if (optionsStatus === 'succeeded') {
      setOptionsLoaded(true);
      chrome.storage.onChanged.addListener(handleStorageChange);
    }
  }, [options, optionsStatus, dispatch]);

  useEffect(() => {
    setNewestFirst(options.defaultSort === 'newest-first');
  }, [optionsLoaded]);

  useEffect(() => {
    for (const prop of Object.getOwnPropertyNames(selectedBookmarks)) {
      delete selectedBookmarks[prop];
    }
    bookmarks.forEach((elem) => {
      selectedBookmarks[elem.id] = false;
    });
  }, [bookmarks])

  return (
    <div className="App">
      <div className="container">
        <Nav
          newestFirst={newestFirst}
          setNewestFirst={setNewestFirst}
          bulkEdit={bulkEdit}
          setBulkEdit={setBulkEdit}
          toaster={toaster.current}
          selectedBookmarks={selectedBookmarks}
          setSelectedBookmarks={setSelectedBookmarks}
        />
        {bulkEdit ? (
          <BulkEditBookmarks
            newestFirst={newestFirst}
            toaster={toaster.current}
            selectedBookmarks={selectedBookmarks}
            setSelectedBookmarks={setSelectedBookmarks}
          />
        ) : (
          <Bookmarks
            newestFirst={newestFirst}
            toaster={toaster.current}
          />
        )}
      </div>
      <Toaster position={Position.BOTTOM_LEFT} ref={toaster} />
    </div>
  );
}

export default App;
