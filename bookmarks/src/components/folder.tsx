import React, {useState} from 'react';
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

interface FolderProps {
  node: TrieNode;
  level: number;
  handleFolderChange(nodeId: string): void;
  activeFolderId: string;
}

const Folder = (props: FolderProps) => {
  const [open, setOpen] = useState<boolean>(true);

  let containsSubfolder = !props.node.children?.every(elem => elem.isPage);
  if (!props.node.children || props.node.children?.length === 0) {
    containsSubfolder = false;
  }

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