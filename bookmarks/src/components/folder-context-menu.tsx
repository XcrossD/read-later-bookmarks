import React, {useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {AnchorPosition} from './folder'

interface FolderContextMenu {
  open: boolean;
  handleClose(): void;
  anchorPosition: AnchorPosition | undefined 
}

const FolderContextMenu = (props: FolderContextMenu) => {
    return (
      <Menu
        open={props.open}
        onClose={props.handleClose}
        anchorReference="anchorPosition"
        anchorPosition={props.anchorPosition}
      >
        <MenuItem onClick={props.handleClose}>Copy</MenuItem>
        <MenuItem onClick={props.handleClose}>Print</MenuItem>
        <MenuItem onClick={props.handleClose}>Highlight</MenuItem>
        <MenuItem onClick={props.handleClose}>Email</MenuItem>
      </Menu>
    );
  }

  export default FolderContextMenu;