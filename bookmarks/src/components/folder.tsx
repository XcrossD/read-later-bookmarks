import React, {useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { TrieNode, TrieTree } from '../data/trie';
import FolderContextMenu from './folder-context-menu';

interface FolderProps {
  node: TrieNode;
  level: number;
  handleFolderChange(nodeId: string): void;
  activeFolderId: string;
}

interface ContextMenu {
  mouseX: number;
  mouseY: number;
}

export interface AnchorPosition {
  top: number;
  left: number;
}

const Folder = (props: FolderProps) => {
  const [open, setOpen] = useState<boolean>(true);
  const [contextMenu, setContextMenu] = React.useState<null|ContextMenu>(null);

  let containsSubfolder = !props.node.children?.every(elem => elem.isPage);
  if (!props.node.children || props.node.children?.length === 0) {
    containsSubfolder = false;
  }

  const handleClick = (e: React.MouseEvent, nodeId: string) => {
    if (e.type === 'click') {
      console.log('Left click');
      props.handleFolderChange(nodeId);
    } else if (e.type === 'contextmenu') {
      console.log('Right click');
      e.preventDefault();
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: e.clientX + 2,
              mouseY: e.clientY - 6,
            }
          : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
            // Other native context menus might behave different.
            // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
            null,
      );
    }
  }

  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <React.Fragment>
      <ListItem
        key={props.node.id}
        secondaryAction={containsSubfolder && (
          open ?
          <IconButton
            edge="end"
            aria-label="close"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <ExpandLess />
          </IconButton> :
          <IconButton
            edge="end"
            aria-label="open"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <ExpandMore />
          </IconButton>
        )}
        disablePadding
      >
        <ListItemButton 
          selected={props.activeFolderId === props.node.id}
          onClick={(e) => {
            handleClick(e, props.node.id);
          }}
          onContextMenu={(e) => {
            handleClick(e, props.node.id);
          }}
          sx={{
            pl: 2 + props.level * 2
          }}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={props.node.title} />
        </ListItemButton>
      </ListItem>
      <FolderContextMenu
        open={contextMenu !== null}
        handleClose={handleClose}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      />
      {containsSubfolder && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {props.node.children?.filter(elem => !elem.isPage).map(elem => (
              <Folder
                node={elem}
                level={props.level + 1}
                handleFolderChange={props.handleFolderChange}
                activeFolderId={props.activeFolderId}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}

export default Folder;