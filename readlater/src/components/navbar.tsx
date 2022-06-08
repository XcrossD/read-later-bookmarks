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
  ButtonGroup,
  IToastProps,
} from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import React from 'react';
import { IOptions } from '../App';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAllBookmarks } from '../features/bookmarks/bookmarksSlice';
import { updateSearchKeyword } from '../features/searchKeyword/searchKeywordSlice';

interface INavProps {
  newestFirst: boolean;
  setNewestFirst(b: boolean): void;
  bulkEdit: boolean;
  setBulkEdit(b: boolean): void;
  toaster: Toaster | null;
  selectedBookmarks: { [key: string]: boolean };
  setSelectedBookmarks(o: { [key: string]: boolean }): void;
}

const Nav = (props: INavProps) => {
  const dispatch = useAppDispatch();
  const searchKeyword = useAppSelector(state => state.searchKeyword);
  const options: IOptions = useAppSelector(state => state.options.options);
  const readLaterFolder: chrome.bookmarks.BookmarkTreeNode | null = useAppSelector(state => state.readLaterFolder.readLaterFolder);
  const bookmarks: Array<chrome.bookmarks.BookmarkTreeNode> = useAppSelector(selectAllBookmarks);

  const addToast = (toast: IToastProps) => {
    props.toaster?.show(toast);
  }

  const handleBulkArchive = () => {
    const bookmarkIds = Object.keys(props.selectedBookmarks)
      .filter(id => props.selectedBookmarks[id]);
    Promise.all(bookmarkIds.map(id => {
      return chrome.bookmarks.move(id, { parentId: options.defaultArchiveId })
    }))
      .then((results) => {
        addToast({
          message: `${bookmarkIds.length} items archived`,
          action: {
            onClick: () => {
              results.forEach(result => {
                chrome.bookmarks.move(result.id,
                  { parentId: readLaterFolder?.id }
                );
              });
            },
            text: "Undo",
          }
        } as IToastProps)
      })
      .catch(console.error)
  };

  const handleBulkDelete = () => {
    const bookmarkIds = Object.keys(props.selectedBookmarks)
      .filter(id => props.selectedBookmarks[id]);
    const bookmarkCopy = bookmarks.filter(elem => bookmarkIds.indexOf(elem.id) !== -1)
    Promise.all(bookmarkIds.map(id => {
      return chrome.bookmarks.remove(id)
    }))
      .then(() => {
        addToast({
          message: `${bookmarkIds.length} items deleted`,
          action: {
            onClick: () => {
              bookmarkCopy.forEach(node => {
                chrome.bookmarks.create({
                  parentId: readLaterFolder?.id,
                  title: node.title,
                  url: node.url
                });
              });
            },
            text: "Undo",
          }
        } as IToastProps)
      })
      .catch(console.error)
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchKeyword(e.target.value.toLowerCase()))
  };

  const handleSearchClear = () => {
    dispatch(updateSearchKeyword(''))
  };

  const handleClearBtn = () => {
    if (numOfItemsSelected > 0) {
      const newResult = {...props.selectedBookmarks};
      Object.keys(newResult).forEach(id => newResult[id] = false)
      props.setSelectedBookmarks(newResult);
    } else {
      props.setBulkEdit(false)
    }
  };

  const sortMenu = (
    <Menu>
      <MenuItem icon="sort-asc" text="Oldest first" onClick={() => props.setNewestFirst(false)}/>
      <MenuItem icon="sort-desc" text="Newest first" onClick={() => props.setNewestFirst(true)}/>
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

  const numOfItemsSelected = Object.values(props.selectedBookmarks)
    .reduce((prev, curr) => {
      return curr ? prev + 1 : prev;
    }, 0);

  return (
    <Navbar className="navbar-fix-top">
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Read Later Bookmarks</NavbarHeading>
        {props.bulkEdit ? (
          <React.Fragment>
            <ButtonGroup>
              <Button
                icon="archive"
                className={Classes.BUTTON}
                text="Archive"
                disabled={numOfItemsSelected === 0}
                onClick={handleBulkArchive}
              />
              {/* <Button
                icon="export"
                className={Classes.BUTTON}
                onClick={handleShare}
              /> */}
              <Button
                icon="trash"
                className={Classes.BUTTON}
                text="Delete"
                disabled={numOfItemsSelected === 0}
                onClick={handleBulkDelete}  
              />
            </ButtonGroup>
            <span className="navbar__item-count">
              {numOfItemsSelected > 0 ? `${numOfItemsSelected} items` : 'Select items'}
            </span>
          </React.Fragment>
        ) : (
          <ControlGroup>
            <InputGroup
                leftIcon="search"
                placeholder="Search bookmarks"
                onChange={handleSearchChange}
                rightElement={searchKeyword.length > 0 ? searchClear : undefined}
                value={searchKeyword}
            />
          </ControlGroup>
        )}
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {/* <Button className={Classes.MINIMAL} icon="document" text="Tag" /> */}
        {props.bulkEdit ? (
          <ButtonGroup>
            <Button
              className={Classes.MINIMAL}
              text={numOfItemsSelected > 0 ? "Clear" : "Cancel"}
              onClick={handleClearBtn}
            />
            <Button
              className={Classes.MINIMAL}
              icon="cross"
              onClick={() => props.setBulkEdit(false)}
            />
          </ButtonGroup>
        ) : (
          <React.Fragment>
            <Popover2 content={sortMenu} placement="auto">
              <Button className={Classes.MINIMAL} icon={props.newestFirst ? "sort-desc" : "sort-asc"} text="Sort" />
            </Popover2>
            <Button
              className={Classes.MINIMAL}
              icon="edit"
              text="Bulk edit"
              onClick={() => props.setBulkEdit(true)}
            />
          </React.Fragment>
        )}
      </NavbarGroup>
    </Navbar>
  )  
}

export default Nav;