import React from 'react';
import { useAppSelector } from '../../app/hooks';
import moment from 'moment';
import { Button, ButtonGroup, Card, Classes, H5, Icon, IToastProps, NonIdealState, Toaster } from '@blueprintjs/core';
import { selectAllBookmarks } from './bookmarksSlice';
import { BookmarkMeta, selectAllBookmarkMetas } from '../bookmarkMetas/bookmarkMetasSlice';

interface BookmarksProps {
  newestFirst: boolean;
  toaster: Toaster | null;
  selectedBookmarks: { [key: string]: boolean };
  setSelectedBookmarks(o: { [key: string]: boolean }): void;
}

const BulkEditBookmarks = (props: BookmarksProps) => {
  const bookmarks: Array<chrome.bookmarks.BookmarkTreeNode> = useAppSelector(selectAllBookmarks);
  const bookmarkMetas: Array<BookmarkMeta> = useAppSelector(selectAllBookmarkMetas);
  const searchKeyword: string = useAppSelector(state => state.searchKeyword);

  const addToast = (toast: IToastProps) => {
    props.toaster?.show(toast);
  }

  const handleCardClick = (id: string) => {
    const newResult = {...props.selectedBookmarks};
    newResult[id] = !newResult[id];
    props.setSelectedBookmarks(newResult);
  }

  const applyChangesToData = () => {
    let newBookmarks = [...bookmarks];
    let newBookmarkMetas = [...bookmarkMetas];
    newBookmarks.sort((a, b) => props.newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
    newBookmarkMetas.sort((a, b) => {
      const bookmarkA = newBookmarks.find(elem => elem.id === a.id);
      const bookmarkB = newBookmarks.find(elem => elem.id === b.id);
      return props.newestFirst ?
        bookmarkB?.dateAdded! - bookmarkA?.dateAdded! :
        bookmarkA?.dateAdded! - bookmarkB?.dateAdded! 
    })
    if (searchKeyword.length > 0) {
      newBookmarks = newBookmarks.filter((elem) => {
        return elem.title.toLowerCase().includes(searchKeyword) ||
          elem.url?.toLowerCase().includes(searchKeyword);
      });
      newBookmarkMetas = newBookmarkMetas.filter((meta) => {
        const bookmark = newBookmarks.find(elem => elem.id === meta.id);
        return bookmark;
      });
    }
    return [newBookmarks, newBookmarkMetas] as [Array<chrome.bookmarks.BookmarkTreeNode>, Array<BookmarkMeta>];
  };

  const [changedBookmarks, changedbookmarkMetas] = applyChangesToData();

  return (
    <div className="bookmark-wrapper">
      {changedBookmarks.map((elem, index) => {
        const dateAdded = moment(elem.dateAdded),
          metaLoaded = bookmarkMetas.length === bookmarks.length,
          selected = props.selectedBookmarks[elem.id];
        return (
          <Card
            className={`bookmark-card--bulkmode ${selected ? "bookmark-card--selected" : ""}`}
            interactive
            onClick={() => handleCardClick(elem.id)}
          >
            <Icon
              className="bookmark-card-selection"
              icon={selected ? "selection" : "circle"}
              color="rgba(0, 0, 0, 0.8)"
            />
            <img
              className={metaLoaded ? "bookmark-card-image bookmark-card-image--bulkmode" : Classes.SKELETON}
              src={metaLoaded ? changedbookmarkMetas[index].image || 'https://picsum.photos/200' : 'https://picsum.photos/200'}
              alt={'Thumbnail'}
            />
            <p>{dateAdded.format('MMM Do YYYY, h:mm:ss a')}</p>
            <div className="truncate">
              <H5 className="bookmark-card-title">
                {elem.title}
              </H5>
            </div>
            <ButtonGroup>
              <Button
                icon="archive"
                className={Classes.BUTTON}
                disabled={true}
              />
              <Button
                icon="export"
                className={Classes.BUTTON}
                disabled={true}
              />
              <Button
                icon="trash"
                className={Classes.BUTTON}
                disabled={true}
              />
            </ButtonGroup>
          </Card>
        );
      })}
      {changedBookmarks.length === 0 && (
        <NonIdealState 
          className="empty-message"
          icon={searchKeyword.length > 0 ? 'search' : 'book'}
          title={searchKeyword.length > 0 ? "No search results" : "No bookmarks in folder"}
          description={(
            <div>
              {searchKeyword.length > 0 ? "Your search didn't match any bookmarks." : "Please add some bookmarks to \"Read Later Bookmarks\" to get started"}
            </div>
          )}
        />
      )}
    </div>
  )
}

export default BulkEditBookmarks;