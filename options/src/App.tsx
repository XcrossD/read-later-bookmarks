import { Button, ControlGroup, FormGroup, H1, H3, HTMLSelect, Label, Position, Switch } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React, { useEffect, useState } from 'react';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import './App.css';
import * as Folder from './components/folder'

const DEFAULT_SETTINGS = {
  defaultArchiveId: '1',
  openBookmarkInNewTab: false,
  actionOnBookmarkClicked: 'none'
};

function App() {
  const [defaultArchiveFolder, setDefaultArchiveFolder] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);
  const [openBookmarkInNewTab, setOpenBookmarkInNewTab] = useState<boolean>(false);
  const [actionOnBookmarkClicked, setActionOnBookmarkClicked] = useState<string>('none');
  
  useEffect(() => {
    const getAndSetFolder = async (id: string) => {
      const result = await chrome.bookmarks.get(id);
      setDefaultArchiveFolder(result[0]);
    }
    
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), function(result) {
      console.log("storage get result", result);
      if (Object.keys({}).length === 0) {
        chrome.storage.local.set(DEFAULT_SETTINGS, function() {
          getAndSetFolder(DEFAULT_SETTINGS.defaultArchiveId);
          setOpenBookmarkInNewTab(DEFAULT_SETTINGS.openBookmarkInNewTab);
          setActionOnBookmarkClicked(DEFAULT_SETTINGS.actionOnBookmarkClicked);
        });
      } else {
        getAndSetFolder(result.defaultArchiveId);
        setOpenBookmarkInNewTab(result.openBookmarkInNewTab);
        setActionOnBookmarkClicked(result.actionOnBookmarkClicked);
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      console.log("changes", changes);
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        switch(key) {
          case 'defaultArchiveId':
            getAndSetFolder(newValue);
            break;
          case 'openBookmarkInNewTab':
            setOpenBookmarkInNewTab(newValue);
            break;
          case 'actionOnBookmarkClicked':
            setActionOnBookmarkClicked(newValue);
            break;
          default:
            break;
        }
      }
    })
  }, []);

  const handleNewTabChange = () => {
    chrome.storage.local.set({
      openBookmarkInNewTab: !openBookmarkInNewTab,
    });
  }
  
  return (
    <div className="App">
      <H1>General Settings</H1>
      <FormGroup
        disabled={false}
        inline={true}
        label="Default archive location"
      >
        <Popover2
          enforceFocus={false}
          placement="bottom-start"
          content={<Folder.TreeFolder defaultArchiveId={defaultArchiveFolder?.id} />}
        >
          <Button text={defaultArchiveFolder?.title} tabIndex={0} rightIcon="double-caret-vertical" />
        </Popover2>
      </FormGroup>
      {/* <div className="option">
        <span className="option-label">Default archive location</span>
        <Popover2
          enforceFocus={false}
          placement="bottom-start"
          content={<Folder.TreeFolder defaultArchiveId={defaultArchiveFolder?.id} />}
        >
          <Button text={defaultArchiveFolder?.title} tabIndex={0} rightIcon="double-caret-vertical" />
        </Popover2>
      </div> */}
      <FormGroup
        disabled={false}
        inline={true}
        label="Open bookmark in new tab"
      >
        <Switch
          checked={openBookmarkInNewTab}
          onChange={handleNewTabChange}
        />
      </FormGroup>
    </div>
  );
}

export default App;
