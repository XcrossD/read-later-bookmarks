import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Button, ButtonGroup, Card, Classes, H5, IToastProps } from '@blueprintjs/core';

interface BookmarksProps {
  readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null;
  bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>;
  setBookmarks(bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>): void;
  refreshBookmarks(): void;
  showToast(toastObj: IToastProps): void;
}

interface meta {
  description: string | null;
  image: string | null;
}

const parser = new DOMParser();

const Bookmarks = (props: BookmarksProps) => {
  const [bookmarkMetas, setBookmarkMetas] = useState<Array<meta>>([]);

  useEffect(() => {
    const bookmarksCopy = props.bookmarks.filter(elem => elem.url);
    const promiseArr = bookmarksCopy.map((elem: chrome.bookmarks.BookmarkTreeNode) => {
      return fetch(elem.url as string);
    });
    Promise.all(promiseArr)
      .then((responses) => Promise.all(responses.map(res => res.text())))
      .then((responseTexts) => {
        const metas = responseTexts.map((text) => {
          const doc = parser.parseFromString(text, "text/html");
          const metatags = doc.getElementsByTagName("meta");
          const metaObj = {
            description: null,
            image: null,
          } as meta;
          for (let i = 0; i < metatags.length; i += 1) {
            if (metatags[i].getAttribute('name') === 'description') {
              metaObj['description'] = metatags[i].getAttribute('content')
            }
            if (metatags[i].getAttribute('name') === 'og:image') {
              metaObj['image'] = metatags[i].getAttribute('content')
            }
            if (metatags[i].getAttribute('name') === 'twitter:image') {
              metaObj['image'] = metatags[i].getAttribute('content')
            }
          }
          return metaObj;
        });
        setBookmarkMetas(metas);
      })
      .catch(console.error);
  }, [props.bookmarks]);

  const handleArchive = (id: string) => {
    // chrome.bookmarks.getTree((result) => console.log(result));
    chrome.bookmarks.move(id, { parentId: '2' }, () => props.refreshBookmarks());
  };

  const handleShare = () => {

  };

  const handleDelete = (node: chrome.bookmarks.BookmarkTreeNode) => {
    chrome.bookmarks.remove(node.id, () => {
      props.refreshBookmarks();
      props.showToast({
        message: 'Bookmark deleted',
        timeout: 0
      })
    });
  };

  return (
    <div className="bookmark-wrapper">
      {props.bookmarks.map((elem, index) => {
        const dateAdded = moment(elem.dateAdded),
          metaLoaded = bookmarkMetas.length === props.bookmarks.length;
        return (
          <Card>
            <img
              className={metaLoaded ? "bookmark-card-image" : Classes.SKELETON}
              src={metaLoaded ? bookmarkMetas[index].image || 'https://picsum.photos/200' : 'https://picsum.photos/200'}
              alt={'Thumbnail'}
            />
            <p>{dateAdded.format('MMM Do YYYY, h:mm:ss a')}</p>
            <div className="truncate">
              <H5 className="bookmark-card-title">
                <a href={elem.url}>{elem.title}</a>
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
    </div>
  )
}

export default Bookmarks;