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
import { TrieNode, TrieTree } from '../data/trie';

interface SidebarProps {
  data: null | TrieTree
  activeFolderId: string
  handleFolderChange(nodeId: string): void
}

interface OpenState {
  [key: string]: boolean
}

const Sidebar = (props: SidebarProps) => {
  const [open, setOpen] = useState<OpenState>({});
  const rootNode = props.data?.root;

  const dumpFolder = (node: TrieNode, level: number) => {
    let containsSubfolder = !node.children?.every(elem => elem.isPage);
    if (!node.children || node.children?.length === 0) {
      containsSubfolder = false;
    }
    if (containsSubfolder && !(node.id in open)) {
      let newNodeOpenState = {} as OpenState;
      newNodeOpenState[node.id] = true;
      setOpen(open => (
        {
          ...open,
          ...newNodeOpenState
        }
      ));
    }
    
    return (
      <React.Fragment>
        <ListItem
          key={node.id}
          secondaryAction={containsSubfolder && (
            open[node.id] ?
            <IconButton
              edge="end"
              aria-label="close"
              onClick={() => {
                if (containsSubfolder) {
                  let newNodeOpenState = {} as OpenState;
                  newNodeOpenState[node.id] = !open[node.id];
                  setOpen(open => (
                    {
                      ...open,
                      ...newNodeOpenState
                    }
                  ));
                }
              }}
            >
              <ExpandLess />
            </IconButton> :
            <IconButton
              edge="end"
              aria-label="open"
              onClick={() => {
                if (containsSubfolder) {
                  let newNodeOpenState = {} as OpenState;
                  newNodeOpenState[node.id] = !open[node.id];
                  setOpen(open => (
                    {
                      ...open,
                      ...newNodeOpenState
                    }
                  ));
                }
              }}
            >
              <ExpandMore />
            </IconButton>
          )}
          disablePadding
        >
          <ListItemButton 
            selected={props.activeFolderId === node.id}
            onClick={() => {
              props.handleFolderChange(node.id);
            }}
            sx={{
              pl: 2 + level * 2
            }}
          >
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={node.title} />
          </ListItemButton>
        </ListItem>
        {containsSubfolder && (
          <Collapse in={open[node.id]} timeout="auto" unmountOnExit>
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