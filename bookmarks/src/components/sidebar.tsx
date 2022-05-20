import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import ContextMenu from './sidebar-context-menu';
import { TrieNode, TrieTree } from '../data/trie';
import Folder from './folder';

interface SidebarProps {
  data: null | TrieTree
  activeFolderId: string
  handleFolderChange(nodeId: string): void
}

// interface OpenState {
//   [key: string]: boolean
// }

const Sidebar = (props: SidebarProps) => {
  const rootNode = props.data?.root;

  const dumpFolder = (node: TrieNode, level: number) => {
    return (
      <Folder
        node={node}
        level={level}
        handleFolderChange={props.handleFolderChange}
        activeFolderId={props.activeFolderId}
      />
    )
  }
  
  return (
    <Box
      component="nav"
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        <div>
          <Typography variant="h6" noWrap component="div">
            Bookmarks
          </Typography>
          <Divider />
          <List>
            <ListItemButton>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={"Read later"} />
            </ListItemButton>
          </List>
          <Divider />
          <List>
            {rootNode?.children?.map(elem => dumpFolder(elem, 0))}
          </List>
        </div>
      </Drawer>
    </Box>
  )
}

export default Sidebar