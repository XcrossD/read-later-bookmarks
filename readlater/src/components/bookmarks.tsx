import React, { useEffect, useState } from 'react';
import { Button, Card, Classes, H5 } from '@blueprintjs/core';

interface BookmarksProps {
  readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null;
  bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>;
}

interface meta {
  description: string | null;
  image: string | null;
}

const parser = new DOMParser();

const Bookmarks = (props: BookmarksProps) => {
  const [bookmarkMetas, setBookmarkMetas] = useState<Array<meta>>([]);

  useEffect(() => {
    const promiseArr = props.bookmarks.filter(elem => elem.url)
      .map((elem: chrome.bookmarks.BookmarkTreeNode) => {
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
      });
  }, [props.bookmarks])

  return (
    <div className="bookmark-wrapper">
      {props.bookmarks.map((elem, index) => {
        return (
          <Card>
            <H5>
                <a href={elem.url}>{elem.title}</a>
            </H5>
            <img
              className={bookmarkMetas.length === 0 ? Classes.SKELETON : "bookmark-card-image"}
              src={bookmarkMetas.length === 0 ? 'https://picsum.photos/200' : bookmarkMetas[index].image || 'https://picsum.photos/200'}
            />
            <p
              className={bookmarkMetas.length === 0 ? Classes.SKELETON : ""}
            >
              {bookmarkMetas.length === 0 ? 'Bookmark description' : bookmarkMetas[index].description}
            </p>
            <Button text="Explore products" className={Classes.BUTTON} />
          </Card>
        );
      })}
    </div>
  )
}

export default Bookmarks;