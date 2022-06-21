import { Button, ControlGroup, FormGroup, H1, H3, HTMLSelect, Label, Position, Switch } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React, { useEffect, useState } from 'react';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import './App.css';
import * as Folder from './components/folder'
import ExportSettings from './components/export';

export type IOptions = {
  [key: string]: any;
  defaultArchiveId: string;
  openBookmarkInNewTab: boolean;
  actionOnBookmarkClicked: string;
  defaultSort: string;
};

export const DEFAULT_SETTINGS = {
  defaultArchiveId: '1',
  openBookmarkInNewTab: false,
  actionOnBookmarkClicked: 'none',
  defaultSort: 'oldest-first'
};

const OPEN_ACTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Delete bookmark after viewing', value: 'delete' },
  { label: 'Archive bookmark after viewing', value: 'archive' }
];

const SORT_OPTIONS = [
  { label: 'Oldest first', value: 'oldest-first' },
  { label: 'Newest first', value: 'newest-first' }
];

function App() {
  const [defaultArchiveFolder, setDefaultArchiveFolder] = useState<chrome.bookmarks.BookmarkTreeNode | null>(null);
  const [openBookmarkInNewTab, setOpenBookmarkInNewTab] = useState<boolean>(DEFAULT_SETTINGS.openBookmarkInNewTab);
  const [actionOnBookmarkClicked, setActionOnBookmarkClicked] = useState<string>(DEFAULT_SETTINGS.actionOnBookmarkClicked);
  const [defaultSort, setDefaultSort] = useState<string>(DEFAULT_SETTINGS.defaultSort);
  
  useEffect(() => {
    const getAndSetFolder = async (id: string) => {
      const result = await chrome.bookmarks.get(id);
      setDefaultArchiveFolder(result[0]);
    };

    const setValueByKey = (key: string, value: IOptions[keyof IOptions]) => {
      switch(key) {
        case 'defaultArchiveId':
          getAndSetFolder(value);
          break;
        case 'openBookmarkInNewTab':
          setOpenBookmarkInNewTab(value);
          break;
        case 'actionOnBookmarkClicked':
          setActionOnBookmarkClicked(value);
          break;
        case 'defaultSort':
          setDefaultSort(value);
          break;
        default:
          break;
      }
    }
    
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), function(result) {
      // console.log("storage get result", result);
      for (const [key, value] of Object.entries(result)) {
        setValueByKey(key, value);
      }
      if (Object.keys(result).length === 0) {
        chrome.storage.local.set(DEFAULT_SETTINGS, function() {
          for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
            setValueByKey(key, value);
          }
        });
      } else if (Object.keys(result).length !== Object.keys(DEFAULT_SETTINGS).length) {
        for (let key of Object.keys(DEFAULT_SETTINGS)) {
          if (!(key in result)) {
            chrome.storage.local.set({[key]: DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]}, function() {
              setValueByKey(key, DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS]);
            });
          }
        }
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      // console.log("changes", changes);
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        setValueByKey(key, newValue);
      }
    });
  }, []);

  const handleNewTabChange = () => {
    chrome.storage.local.set({
      openBookmarkInNewTab: !openBookmarkInNewTab,
    });
  };

  const handlePostActionChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const action = e.currentTarget.value;
    chrome.storage.local.set({
      actionOnBookmarkClicked: action,
    });
  };

  const handleSortChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const sort = e.currentTarget.value;
    chrome.storage.local.set({
      defaultSort: sort,
    });
  };
  
  return (
    <div className="App">
      <H1 className="title">General Settings</H1>
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
      <FormGroup
        disabled={false}
        inline={true}
        label="Action to perform after viewing bookmark"
      >
        <HTMLSelect
          options={OPEN_ACTIONS}
          value={actionOnBookmarkClicked}
          onChange={handlePostActionChange}  
        />
      </FormGroup>
      <FormGroup
        disabled={false}
        inline={true}
        label="Default sort"
      >
        <HTMLSelect
          options={SORT_OPTIONS}
          value={defaultSort}
          onChange={handleSortChange}  
        />
      </FormGroup>
      <ExportSettings />
    </div>
  );
}

export default App;
