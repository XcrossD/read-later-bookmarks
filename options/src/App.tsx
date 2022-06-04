import { Button, ControlGroup, H1, H3, HTMLSelect, Label, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React, { useEffect, useState } from 'react';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import './App.css';
import * as Folder from './components/folder'

function App() {
  const [defaultArchiveFolder, setDefaultArchiveFolder] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);
  
  useEffect(() => {
    const getAndSetFolder = async (id: string) => {
      const result = await chrome.bookmarks.get(id);
      setDefaultArchiveFolder(result[0]);
    }
    
    chrome.storage.local.get(['preference'], function(result) {
      if (!result.key) {
        chrome.storage.local.set({
          preference: {
            defaultArchiveId: '1'
          }
        }, function() {
          getAndSetFolder('1');
        });
      } else {
        getAndSetFolder(result.key.defaultArchiveId);
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      getAndSetFolder(changes.preference.newValue.defaultArchiveId);
    })
  }, []);
  
  return (
    <div className="App">
      <H1>General Settings</H1>
      <div className="option">
        <span className="option-label">Default archive location</span>
        <Popover2
          enforceFocus={false}
          placement="bottom-start"
          content={<Folder.TreeFolder defaultArchiveId={defaultArchiveFolder?.id} />}
        >
          <Button text={defaultArchiveFolder?.title} tabIndex={0} rightIcon="double-caret-vertical" />
        </Popover2>
      </div>
    </div>
  );
}

export default App;
