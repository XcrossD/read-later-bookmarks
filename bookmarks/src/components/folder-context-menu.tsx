import React, {useState} from 'react';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {AnchorPosition} from './folder';
import { TrieNode, TrieTree } from '../data/trie';

interface FolderContextMenu {
  node: TrieNode;
  open: boolean;
  handleClose(): void;
  anchorPosition: AnchorPosition | undefined 
}

const FolderContextMenu = (props: FolderContextMenu) => {
    const numOfChildrenPages = props.node.children?.filter(elem => elem.isPage).length;

    const handleRename = async () => {
      
    }

    return (
      <Menu
        open={props.open}
        onClose={props.handleClose}
        anchorReference="anchorPosition"
        anchorPosition={props.anchorPosition}
      >
        <MenuItem onClick={props.handleClose}>Rename</MenuItem>
        <MenuItem onClick={props.handleClose}>Delete</MenuItem>
        <Divider />
        <MenuItem onClick={props.handleClose}>Cut</MenuItem>
        <MenuItem onClick={props.handleClose}>Copy</MenuItem>
        <MenuItem onClick={props.handleClose}>Paste</MenuItem>
        <Divider />
        <MenuItem onClick={props.handleClose}>{`Open all (${numOfChildrenPages})`}</MenuItem>
        <MenuItem onClick={props.handleClose}>{`Open all (${numOfChildrenPages}) in new window`}</MenuItem>
        <MenuItem onClick={props.handleClose}>{`Open all (${numOfChildrenPages}) in incognito window`}</MenuItem>
      </Menu>
    );
  }

  export default FolderContextMenu;