import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import logo from './logo.svg';
import './App.css';
import {
  Divider,
  ButtonGroup,
  Button
} from '@blueprintjs/core';

const Container = styled.div`
  min-width: 300px;
  min-height: 300px;
  padding: 1em;
  display: flex;
  flex-direction: column;
`;

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
      const bookmarks = await chrome.bookmarks.search(currTabUrl);
      console.log(bookmarks);
      if (bookmarks.length > 0) {
        setPageInBookmarks(true);
      } else {
        setPageInBookmarks(false);
      }
    };

    findBookmark()
      .catch(console.error);
  }, []);

  const handleBookmarkAction = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
  };
  
  const openReadLaterView = () => {
    chrome.tabs.create({ 'url': 'bookmarks/build/index.html'})
  };

  return (
    <div className="App">
      <Container>
        <SaveStateDisplay>
          {
            pageInBookmarks ?
            <h2>Saved</h2> :
            <h2>Not saved</h2>
          }
          <a href="" onClick={(e) => handleBookmarkAction(e)}>{pageInBookmarks ? 'Remove' : 'Save'}</a>
        </SaveStateDisplay>
        <Divider />
        <ButtonGroup style={{ minWidth: 200 }}>
          <Button
            icon="page-layout"
            onClick={openReadLaterView}
          >
            Open read later view
          </Button>
          <Button icon="cog">Options</Button>
        </ButtonGroup>
      </Container>
    </div>
  );
}

export default App;
