import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import FolderIcon from '@mui/icons-material/Folder';

import {TrieTree, TrieNode} from '../data/trie';
import { Grid } from '@mui/material';

interface BookmarksProps {
  data: null | TrieTree
  activeFolderId: string
  handleFolderChange(nodeId: string): void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Bookmarks = (props: BookmarksProps) => {
  const handlePageClick = (event: React.MouseEvent<HTMLInputElement>, url: string) => {
    window.open(url);
  };
  
  const dumpBookmarks = (node: TrieNode | null | undefined) => {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search bookmarks"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Grid>
        <List>
          {node?.children?.map(elem => {
            return dumpNode(elem);
          })}
        </List>
      </Grid>
    );
  }

  const dumpNode = (node: TrieNode) => {
    if (node.isPage) {
      return (
        <ListItemButton
          selected={props.activeFolderId === node.id}
          onClick={(event) => props.handleFolderChange(node.id)}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText
            primary={node.title}
          />
        </ListItemButton>
        // <a className="panel-block" href={node.url} target="_blank">
        //   <span className="panel-icon">
        //     <i className="fas fa-book" aria-hidden="true"></i>
        //   </span>
        //   {node.title}
        // </a>
      );
    } else {
      return (
        <React.Fragment>
          <ListItemButton
            selected={props.activeFolderId === node.id}
            onClick={(event) => props.handleFolderChange(node.id)}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText
              primary={node.title}
            />
          </ListItemButton>
          {node.children?.map((node) => {
            return dumpNode(node);
          })}
        </React.Fragment>
        // <React.Fragment>
        //   <a
        //     className="panel-block"
        //     onClick={() => { props.handleFolderChange(node.id) }}
        //   >
        //     <span className="panel-icon">
        //       <i className="fas fa-folder" aria-hidden="true"></i>
        //     </span>
        //     {node.title}
        //   </a>
        //   {node.children?.map((node) => {
        //     return dumpNode(node);
        //   })}
        // </React.Fragment>
      ); 
    }
  }

  const startingBookmark = props.data?.search(props.activeFolderId);
  
  return (
    <div className="column">
      {dumpBookmarks(startingBookmark)}
    </div>
  );
};

export default Bookmarks;