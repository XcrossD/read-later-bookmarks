import React, { useEffect, useState } from 'react';

const OriginalBookmarks = () => {
  const [tree, setTree] = useState([] as chrome.bookmarks.BookmarkTreeNode[])

  useEffect(() => {
    chrome.bookmarks.getTree((treeNode) => {
      setTree(treeNode)
    });
  });

  const dumpBookmarks = () => {
    return (
      <nav className="panel">
        <div className="panel-block">
          <p className="control has-icons-left">
            <input className="input" type="text" placeholder="Search" />
            <span className="icon is-left">
              <i className="fas fa-search" aria-hidden="true"></i>
            </span>
          </p>
        </div>
        {tree.map((node) => {
          return dumpNode(node)
        })}
      </nav>
    );
  }

  const dumpNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
    if (node.title != "") {
      return (
        <React.Fragment>
          <a className="panel-block" href={node.url} target="_blank">
            <span className="panel-icon">
              <i className="fas fa-book" aria-hidden="true"></i>
            </span>
            {node.title}
          </a>
          {node.children?.map((node) => {
            return dumpNode(node)
          })}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {node.children?.map((node) => {
            return dumpNode(node);
          })}
        </React.Fragment>
      ); 
    }
  }
  
  return (
    <div className="column">
      {dumpBookmarks()}
    </div>
  );
}

export default OriginalBookmarks;