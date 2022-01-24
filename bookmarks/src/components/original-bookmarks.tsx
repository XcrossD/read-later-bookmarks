import React, { useEffect, useState } from 'react';
import {TrieTree, TrieNode} from '../data/trie';

interface OriginalBookmarksProps {
  data: null | TrieTree
}

const OriginalBookmarks = (props: OriginalBookmarksProps) => {
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
        {props.data?.root?.children?.map(elem => {
          return dumpNode(elem);
        })}
      </nav>
    );
  }

  const dumpNode = (node: TrieNode) => {
    if (node.isPage) {
      return (
        <a className="panel-block" href={node.url} target="_blank">
          <span className="panel-icon">
            <i className="fas fa-book" aria-hidden="true"></i>
          </span>
          {node.title}
        </a>
      );
    } else {
      return (
        <React.Fragment>
          <a className="panel-block">
            <span className="panel-icon">
              <i className="fas fa-folder" aria-hidden="true"></i>
            </span>
            {node.title}
          </a>
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