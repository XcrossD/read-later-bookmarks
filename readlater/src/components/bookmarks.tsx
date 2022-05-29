import React from 'react';
import { Button, Card, Classes, H5 } from '@blueprintjs/core';

interface BookmarksProps {
  readLaterFolder: chrome.bookmarks.BookmarkTreeNode|null;
  bookmarks: Array<chrome.bookmarks.BookmarkTreeNode>;
}

const Bookmarks = (props: BookmarksProps) => {
  return (
    <div className="bookmark-wrapper">
      {props.bookmarks.map((elem) => (
        <Card>
          <H5>
              <a href={elem.url}>{elem.title}</a>
          </H5>
          <p>
              User interfaces that enable people to interact smoothly with data, ask better questions, and
              make better decisions.
          </p>
          <Button text="Explore products" className={Classes.BUTTON} />
        </Card>
      ))}
    </div>
  )
}

export default Bookmarks;