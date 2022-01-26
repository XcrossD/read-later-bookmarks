import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import { TrieNode, TrieTree } from '../data/trie';

interface SidebarProps {
  data: null | TrieTree
  activeFolderId: string
  handleFolderChange(nodeId: string): void
}

const Sidebar = (props: SidebarProps) => {
  const rootNode = props.data?.root;

  const dumpFolder = (node: TrieNode, level: number) => {
    return (
      <React.Fragment>
        <ListItemButton 
          className={props.activeFolderId === node.id ? "is-active" : ""}
          onClick={() => { props.handleFolderChange(node.id); }}
          sx={{
            pl: level * 4
          }}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={node.title} />
        </ListItemButton>
        {node.children && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children?.filter(elem => !elem.isPage).map(elem => {
                return dumpFolder(elem, level + 1);
              })}
            </List>
          </Collapse>
        )}
      </React.Fragment>
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