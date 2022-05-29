import React, { useEffect, useRef, useState } from 'react';
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
import { url } from 'inspector';

const SaveStateDisplay = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OptionsDisplay = styled.div`
  display: flex;
`;

const App = () => {
  const [pageInBookmarks, setPageInBookmarks] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const findBookmark = async () => {
      const currTabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      const currTabUrl = currTabs[0].url as string;
      const bookmarks = await chrome.bookmarks.search({ url: currTabUrl });
      if (bookmarks.length > 0) {
        setPageInBookmarks(true);
      } else {
        setPageInBookmarks(false);
      }
    };

    findBookmark()
      .catch(console.error);
  }, []);

  const handleBookmarkAction = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
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

    const findCurrentTab = async () => {
      const currTabs = await chrome.tabs.query({active: true, lastFocusedWindow: true});
      return currTabs[0];
    }

    const findCurrentTabBookmark = async (tab: chrome.tabs.Tab) => {
      const bookmarks = await chrome.bookmarks.search({ url: tab.url });
      return bookmarks[0];
    }

    const currTab = await findCurrentTab();
    if (pageInBookmarks) {
      const currTabBookmark = await findCurrentTabBookmark(currTab);
      chrome.bookmarks.remove(currTabBookmark.id, () => setPageInBookmarks(false));
    } else {
      let readLaterFolder = await findOrCreateReadLaterFolder();
      chrome.bookmarks.create({
        parentId: readLaterFolder.id,
        title: currTab.title,
        url: currTab.url
      }, () => {setPageInBookmarks(true)});
    }
  };
  
  const openReadLaterView = () => {
    chrome.tabs.create({ 'url': 'readlater/build/index.html'})
  };

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
          <Button icon="cog">Options</Button>
        </ButtonGroup>
      </Card>
    </div>
  );
}

export default App;
