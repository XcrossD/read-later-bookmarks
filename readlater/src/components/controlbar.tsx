import React, { useState } from 'react';
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
  MenuItem
} from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";

interface ControlBarProps {
  newestFirst: boolean;
  setNewestFirst(arg0: boolean): void;
  readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null
}

const ControlBar = (props: ControlBarProps) => {
  const sortMenu = (
    <Menu>
      <MenuItem icon="sort-asc" text="Oldest first" onClick={() => props.setNewestFirst(false)}/>
      <MenuItem icon="sort-desc" text="Newest first" onClick={() => props.setNewestFirst(true)}/>
    </Menu>
  );
  
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Read Later Bookmarks</NavbarHeading>
        <ControlGroup>
          <InputGroup
              leftIcon="search"
              placeholder="Search bookmarks"
          />
        </ControlGroup>
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {/* <Button className={Classes.MINIMAL} icon="document" text="Tag" /> */}
        <Popover2 content={sortMenu} placement="auto">
          <Button className={Classes.MINIMAL} icon={props.newestFirst ? "sort-desc" : "sort-asc"} text="Sort" />
        </Popover2>
      </NavbarGroup>
    </Navbar>
  )
}

export default ControlBar;