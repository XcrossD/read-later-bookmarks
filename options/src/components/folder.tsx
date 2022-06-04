import { cloneDeep } from "lodash-es";
import { Classes, Tree, TreeNodeInfo } from "@blueprintjs/core";
import { ContextMenu2, Classes as Popover2Classes, Tooltip2 } from "@blueprintjs/popover2";
import { useEffect, useReducer } from "react";
import React from "react";

export interface folder {
  id: string;
  title: string;
}

interface TreeFolderProps {
  defaultArchiveId: string | undefined;
}

type PopulatePayload = { tree: chrome.bookmarks.BookmarkTreeNode[], defaultArchiveId: string | undefined }

type NodePath = number[];

type TreeAction =
    | { type: "SET_IS_EXPANDED"; payload: { path: NodePath; isExpanded: boolean } }
    | { type: "DESELECT_ALL" }
    | { type: "SET_IS_SELECTED"; payload: { path: NodePath; isSelected: boolean } }
    | { type: "POPULATE"; payload: PopulatePayload };

const contentSizing = { popoverProps: { popoverClassName: Popover2Classes.POPOVER2_CONTENT_SIZING } };

function createTreeNodeInfoFromOriginalTree(payload: PopulatePayload): TreeNodeInfo[] {
  const result = [];
  for (const node of payload.tree) {
    if (node.id === '0') {
      return createTreeNodeInfoFromOriginalTree({
        tree: node.children || [],
        defaultArchiveId: payload.defaultArchiveId
      });
    } else {
      const nodeInfo = {
        id: node.id,
        icon: "folder-close",
        isSelected: node.id === payload.defaultArchiveId,
        label: (
            <ContextMenu2 {...contentSizing} content={<div>Hello there!</div>}>
                {node.title}
            </ContextMenu2>
        ),
      } as TreeNodeInfo;
      const children = node.children?.filter(elem => elem.children);
      if (children && children.length > 0) {
        nodeInfo.isExpanded = true
        nodeInfo.childNodes = createTreeNodeInfoFromOriginalTree({
          tree: children,
          defaultArchiveId: payload.defaultArchiveId
        });
      }
      result.push(nodeInfo);
    }
  }
  return result;
}

function forEachNode(nodes: TreeNodeInfo[] | undefined, callback: (node: TreeNodeInfo) => void) {
  if (nodes === undefined) {
    return;
  }

  for (const node of nodes) {
    callback(node);
    forEachNode(node.childNodes, callback);
  }
}

function forNodeAtPath(nodes: TreeNodeInfo[], path: NodePath, callback: (node: TreeNodeInfo) => void) {
  callback(Tree.nodeFromPath(path, nodes));
}

function treeReducer(state: TreeNodeInfo[], action: TreeAction) {
  switch (action.type) {
      case "DESELECT_ALL":
        const newState1 = cloneDeep(state);
        forEachNode(newState1, node => (node.isSelected = false));
        return newState1;
      case "SET_IS_EXPANDED":
        const newState2 = cloneDeep(state);
        forNodeAtPath(newState2, action.payload.path, node => (node.isExpanded = action.payload.isExpanded));
        return newState2;
      case "SET_IS_SELECTED":
        const newState3 = cloneDeep(state);
        forNodeAtPath(newState3, action.payload.path, node => (node.isSelected = action.payload.isSelected));
        return newState3;
      case "POPULATE":
        return createTreeNodeInfoFromOriginalTree(action.payload);
      default:
        return state;
  }
}


export const TreeFolder = (props: TreeFolderProps) => {
  const [nodes, dispatch] = useReducer(treeReducer, []);

  useEffect(() => {
    const createTreeStructure = async () => {
      const tree = await chrome.bookmarks.getTree();
      dispatch({ type: 'POPULATE', payload: { tree, defaultArchiveId: props.defaultArchiveId } });
    }
    createTreeStructure()
      .catch(console.error);
  }, []);

  const handleNodeClick = React.useCallback(
    (node: TreeNodeInfo, nodePath: NodePath, e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = node.isSelected;
        // if (!e.shiftKey) {
        //   dispatch({ type: "DESELECT_ALL" });
        // }
        dispatch({ type: "DESELECT_ALL" });
        dispatch({
            payload: { path: nodePath, isSelected: originallySelected == null ? true : !originallySelected },
            type: "SET_IS_SELECTED",
        });
        chrome.storage.local.set({
          preference: {
            defaultArchiveId: node.id
          }
        });
    },
    [],
  );

  const handleNodeCollapse = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: false },
      type: "SET_IS_EXPANDED",
    });
  }, []);

  const handleNodeExpand = React.useCallback((_node: TreeNodeInfo, nodePath: NodePath) => {
    dispatch({
      payload: { path: nodePath, isExpanded: true },
      type: "SET_IS_EXPANDED",
    });
  }, []);

  return (
    <Tree
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeCollapse={handleNodeCollapse}
      onNodeExpand={handleNodeExpand}
      className={Classes.ELEVATION_0}
    />
  );
}