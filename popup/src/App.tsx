import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './App.css';
import {
  Card,
  Divider,
  ButtonGroup,
  Button,
  H3,
  H5
} from '@blueprintjs/core';

const SaveStateDisplay = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OptionsDisplay = styled.div`
  display: flex;
`;

let readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null = null;

const App = () => {
  const [pageInBookmarks, setPageInBookmarks] = useState<boolean>(false);
  
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
    
    const updateBookmarkStatus = async () => {
      const currTabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      const currTabUrl = currTabs[0].url as string;
      const bookmarks = await chrome.bookmarks.search({ url: currTabUrl });
      let bookmarkInFolder = false;
      if (bookmarks.length > 0) {
        let i = 0;
        while (i < bookmarks.length) {
          if (bookmarks[i].parentId === readLaterFolder?.id) {
            bookmarkInFolder = true;
            break;
          }
          i += 1;
        }
      }
      setPageInBookmarks(bookmarkInFolder);
    };

    findOrCreateReadLaterFolder()
      .then((res) => {
        readLaterFolder = res;
        updateBookmarkStatus();
      })
      .catch(console.error);

    chrome.bookmarks.onChanged.addListener(updateBookmarkStatus);
    chrome.bookmarks.onChildrenReordered.addListener(updateBookmarkStatus);
    chrome.bookmarks.onCreated.addListener(updateBookmarkStatus);
    chrome.bookmarks.onMoved.addListener(updateBookmarkStatus);
    chrome.bookmarks.onRemoved.addListener(updateBookmarkStatus);
  }, []);

  const handleBookmarkAction = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const findCurrentTab = async () => {
      const currTabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      return currTabs[0];
    }

    const findCurrentTabBookmark = async (tab: chrome.tabs.Tab) => {
      const bookmarks = await chrome.bookmarks.search({ url: tab.url });
      let i = 0;
      while (i < bookmarks.length) {
        if (bookmarks[i].parentId === readLaterFolder?.id) {
          return bookmarks[i];
        }
        i += 1;
      }
      return bookmarks[0];
    }

    const currTab = await findCurrentTab();
    if (pageInBookmarks) {
      const currTabBookmark = await findCurrentTabBookmark(currTab);
      chrome.bookmarks.remove(currTabBookmark.id, () => setPageInBookmarks(false));
    } else {
      chrome.bookmarks.create({
        parentId: readLaterFolder?.id,
        title: currTab.title,
        url: currTab.url
      }, () => {setPageInBookmarks(true)});
    }
  };
  
  const openReadLaterView = () => {
    chrome.tabs.create({ 'url': 'readlater/build/index.html'});
  };

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  }

  return (
    <div className="App">
      <Card className="base-card">
        <SaveStateDisplay>
          {
            pageInBookmarks ?
            <H3>Saved</H3> :
            <H3>Not saved</H3>
          }
          <H5 className="save-button-wrapper">
            <a href="" onClick={(e) => handleBookmarkAction(e)}>{pageInBookmarks ? 'Remove' : 'Save'}</a>
          </H5>
        </SaveStateDisplay>
        <Divider />
        <ButtonGroup className="button-group">
          <Button
            icon="page-layout"
            onClick={openReadLaterView}
          >
            Open read later view
          </Button>
          <Button
            icon="cog"
            onClick={openOptionsPage}
          >
            Options
          </Button>
        </ButtonGroup>
      </Card>
    </div>
  );
}

export default App;
