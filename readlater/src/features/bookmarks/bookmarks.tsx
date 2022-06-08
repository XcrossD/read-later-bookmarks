import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import moment from 'moment';
import { Button, ButtonGroup, Card, Classes, H5, IToastProps, NonIdealState, Toaster } from '@blueprintjs/core';
// import { IOptions } from '../../../options/src/App';
import { IOptions } from '../../App';
import { selectAllBookmarks } from './bookmarksSlice';

interface BookmarksProps {
  // readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null;
  searchKeyword: string;
  // bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>;
  // setBookmarks(bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>): void;
  // refreshBookmarks(): void;
  toaster: Toaster | null;
  options: IOptions | null;
}

interface meta {
  description: string | null;
  image: string | null;
}

const parser = new DOMParser();

const Bookmarks = (props: BookmarksProps) => {
  const bookmarks: Array<chrome.bookmarks.BookmarkTreeNode> = useAppSelector(selectAllBookmarks);
  const dispatch = useAppDispatch();
  const [bookmarkMetas, setBookmarkMetas] = useState<Array<meta>>([]);

  // useEffect(() => {
  //   const bookmarksCopy = props.bookmarks.filter(elem => elem.url);
  //   const promiseArr = bookmarksCopy.map((elem: chrome.bookmarks.BookmarkTreeNode) => {
  //     return fetch(elem.url as string);
  //   });
  //   Promise.all(promiseArr)
  //     .then((responses) => Promise.all(responses.map(res => res.text())))
  //     .then((responseTexts) => {
  //       const metas = responseTexts.map((text) => {
  //         const doc = parser.parseFromString(text, "text/html");
  //         const metatags = doc.getElementsByTagName("meta");
  //         const metaObj = {
  //           description: null,
  //           image: null,
  //         } as meta;
  //         for (let i = 0; i < metatags.length; i += 1) {
  //           if (metatags[i].getAttribute('name') === 'description') {
  //             metaObj['description'] = metatags[i].getAttribute('content')
  //           }
  //           if (metatags[i].getAttribute('name') === 'og:image') {
  //             metaObj['image'] = metatags[i].getAttribute('content')
  //           }
  //           if (metatags[i].getAttribute('name') === 'twitter:image') {
  //             metaObj['image'] = metatags[i].getAttribute('content')
  //           }
  //         }
  //         return metaObj;
  //       });
  //       setBookmarkMetas(metas);
  //     })
  //     .catch(console.error);
  // }, [props.bookmarks]);

  const addToast = (toast: IToastProps) => {
    props.toaster?.show(toast);
  }

  const handleLinkClick = (e: React.MouseEvent, node: chrome.bookmarks.BookmarkTreeNode) => {
    switch(props.options?.actionOnBookmarkClicked) {
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
    // chrome.bookmarks.move(id,
    //   { parentId: props.options?.defaultArchiveId },
    //   (result: chrome.bookmarks.BookmarkTreeNode) => {
    //     props.refreshBookmarks();
    //     addToast({
    //       message: `'${result.title}' archived`,
    //       action: {
    //         onClick: () => {
    //           chrome.bookmarks.move(result.id,
    //             { parentId: props.readLaterFolder?.id },
    //             () => props.refreshBookmarks()
    //           );
    //         },
    //         text: "Undo",
    //       }
    //     } as IToastProps)
    //   }
    // );
  };

  const handleShare = () => {

  };

  const handleDelete = (node: chrome.bookmarks.BookmarkTreeNode) => {
    // chrome.bookmarks.remove(node.id, () => {
    //   props.refreshBookmarks();
    //   addToast({
    //     message: `'${node.title}' deleted`,
    //     action: {
    //       onClick: () => {
    //         chrome.bookmarks.create({
    //           parentId: props.readLaterFolder?.id,
    //           title: node.title,
    //           url: node.url
    //         });
    //       },
    //       text: "Undo",
    //     }
    //   } as IToastProps)
    // });
  };

  return (
    <div className="bookmark-wrapper">
      {bookmarks.map((elem, index) => {
        const dateAdded = moment(elem.dateAdded),
          // metaLoaded = bookmarkMetas.length === bookmarks.length;
          metaLoaded = false;
        return (
          <Card>
            <a
              href={elem.url}
              target={props.options?.openBookmarkInNewTab ? "_blank" : "_self"}
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
                  target={props.options?.openBookmarkInNewTab ? "_blank" : "_self"}
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
      {bookmarks.length === 0 && (
        <NonIdealState 
          className="empty-message"
          icon={props.searchKeyword.length > 0 ? 'search' : 'book'}
          title={props.searchKeyword.length > 0 ? "No search results" : "No bookmarks in folder"}
          description={(
            <div>
              {props.searchKeyword.length > 0 ? "Your search didn't match any bookmarks." : "Please add some bookmarks to \"Read Later Bookmarks\" to get started"}
            </div>
          )}
        />
      )}
    </div>
  )
}

export default Bookmarks;