import React from 'react';
import { TrieNode, TrieTree } from '../data/trie';

interface SidebarProps {
  data: null | TrieTree
}

const Sidebar = (props: SidebarProps) => {
  const rootNode = props.data?.root;

  const dumpFolder = (node: TrieNode) => {
    return (
      <React.Fragment>
        <li><a>{node.title}</a></li>
        {node.children && (
          <li>
            <ul>
              {node.children?.filter(elem => !elem.isPage).map(elem => {
                return dumpFolder(elem);
              })} 
            </ul>
          </li>
        )}
      </React.Fragment>
    )
  }
  
  return (
    <div className="column is-one-quarter">
      <aside className="menu">
        <p className="menu-label">
          Bookmarks
        </p>
        <ul className="menu-list">
          {rootNode?.children?.map(elem => dumpFolder(elem))}
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar