import React, { useState } from 'react';
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
`;

const OptionsDisplay = styled.div`
  display: flex;
`;

const App = () => {
  const [pageInBookmarks, setPageInBookmarks] = useState<boolean>(false);
  
  const openReadLaterView = () => {
    chrome.tabs.create({ 'url': 'bookmarks/build/index.html'})
  };

  return (
    <div className="App">
      <Container>
        <SaveStateDisplay>
          
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
