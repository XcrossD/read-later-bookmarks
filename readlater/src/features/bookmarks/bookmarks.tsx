import React from 'react';
import { useAppSelector } from '../../app/hooks';
import moment from 'moment';
import { Button, ButtonGroup, Card, Classes, H5, IToastProps, NonIdealState, Toaster } from '@blueprintjs/core';
import { IOptions } from '../../App';
import { selectAllBookmarks } from './bookmarksSlice';
import { BookmarkMeta, selectAllBookmarkMetas } from '../bookmarkMetas/bookmarkMetasSlice';

interface BookmarksProps {
  newestFirst: boolean;
  toaster: Toaster | null;
}

const Bookmarks = (props: BookmarksProps) => {
  const bookmarks: Array<chrome.bookmarks.BookmarkTreeNode> = useAppSelector(selectAllBookmarks);
  const bookmarkMetas: Array<BookmarkMeta> = useAppSelector(selectAllBookmarkMetas);
  const readLaterFolder = useAppSelector(state => state.readLaterFolder.readLaterFolder);
  const options: IOptions = useAppSelector(state => state.options.options);
  const searchKeyword: string = useAppSelector(state => state.searchKeyword);

  const addToast = (toast: IToastProps) => {
    props.toaster?.show(toast);
  }

  const handleLinkClick = (e: React.MouseEvent, node: chrome.bookmarks.BookmarkTreeNode) => {
    switch(options.actionOnBookmarkClicked) {
      case 'archive':
        handleArchive(node.id);
        break;
      case 'delete':
        handleDelete(node);
        break;
      case 'none':
      default:
        break;
    }
    return true;
  }

  const handleArchive = (id: string) => {
    // chrome.bookmarks.getTree((result) => console.log(result));
    chrome.bookmarks.move(id,
      { parentId: options.defaultArchiveId },
      (result: chrome.bookmarks.BookmarkTreeNode) => {
        addToast({
          message: `'${result.title}' archived`,
          action: {
            onClick: () => {
              chrome.bookmarks.move(result.id,
                { parentId: readLaterFolder?.id }
              );
            },
            text: "Undo",
          }
        } as IToastProps)
      }
    );
  };

  const handleShare = () => {

  };

  const handleDelete = (node: chrome.bookmarks.BookmarkTreeNode) => {
    chrome.bookmarks.remove(node.id, () => {
      addToast({
        message: `'${node.title}' deleted`,
        action: {
          onClick: () => {
            chrome.bookmarks.create({
              parentId: readLaterFolder?.id,
              title: node.title,
              url: node.url
            });
          },
          text: "Undo",
        }
      } as IToastProps)
    });
  };

  const applyChangesToBookmarks = () => {
    let newBookmarks = [...bookmarks];
    newBookmarks.sort((a, b) => props.newestFirst ? b.dateAdded! - a.dateAdded! : a.dateAdded! - b.dateAdded!);
    if (searchKeyword.length > 0) {
      newBookmarks = newBookmarks.filter((elem) => {
        return elem.title.toLowerCase().includes(searchKeyword) ||
          elem.url?.toLowerCase().includes(searchKeyword);
      });
    }
    return newBookmarks;
  };
  const filteredBookmarks = applyChangesToBookmarks();

  return (
    <div className="bookmark-wrapper">
      {filteredBookmarks.map((elem, index) => {
        const dateAdded = moment(elem.dateAdded),
          metaLoaded = bookmarkMetas.length === bookmarks.length;
        return (
          <Card>
            <a
              href={elem.url}
              target={options.openBookmarkInNewTab ? "_blank" : "_self"}
              onClick={(e) => handleLinkClick(e, elem)}
            >
              <img
                className={metaLoaded ? "bookmark-card-image" : Classes.SKELETON}
                src={metaLoaded ? bookmarkMetas[index].image || 'https://picsum.photos/200' : 'https://picsum.photos/200'}
                alt={'Thumbnail'}
              />
            </a>
            <p>{dateAdded.format('MMM Do YYYY, h:mm:ss a')}</p>
            <div className="truncate">
              <H5 className="bookmark-card-title">
                <a
                  href={elem.url}
                  target={options.openBookmarkInNewTab ? "_blank" : "_self"}
                  onClick={(e) => handleLinkClick(e, elem)}
                >
                  {elem.title}
                </a>
              </H5>
            </div>
            <ButtonGroup>
              <Button
                icon="archive"
                className={Classes.BUTTON}
                onClick={() => handleArchive(elem.id)}
              />
              <Button
                icon="export"
                className={Classes.BUTTON}
                onClick={handleShare}
              />
              <Button
                icon="trash"
                className={Classes.BUTTON}
                onClick={() => handleDelete(elem)}  
              />
            </ButtonGroup>
          </Card>
        );
      })}
      {filteredBookmarks.length === 0 && (
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

export default Bookmarks;