class TrieNode {
  children?: Array<TrieNode>;
  dateAdded?: number | undefined;
  dateGroupModified?: number;
  id: string;
  index?: number;
  parentId?: string;
  title: string;
  url?: string;
  isPage: boolean;

  constructor(obj: chrome.bookmarks.BookmarkTreeNode) {
    this.id = obj.id;
    this.title = obj.title;
    this.dateAdded = obj.dateAdded;
    this.dateGroupModified = obj.dateGroupModified;
    this.index = obj.index;
    this.parentId = obj.parentId;
    this.url = obj.url;
    this.isPage = !('children' in obj);
  }

  addChild(node: TrieNode) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
  }

}

class TrieTree {
  root: TrieNode | null;
  
  constructor(){
    this.root = null;
  }

  createNode(obj: chrome.bookmarks.BookmarkTreeNode) {
    const node = new TrieNode(obj);
    if (obj.children) {
      for (const elem of obj.children) {
        node.addChild(this.createNode(elem));
      }
    }
    return node;
  }
  
  populate(arr: chrome.bookmarks.BookmarkTreeNode[]) {
    const rootNode = arr[0];
    this.root = new TrieNode(rootNode);
    if (rootNode.children) {
      for (const elem of rootNode.children) {
        this.root.addChild(this.createNode(elem));
      }
    }
  }

  search(id: string) {
    const queue = [this.root];
    while (queue.length > 0) {
      const currNode = queue.shift();
      if (currNode?.id === id) {
        return currNode;
      }
      if (currNode?.children) {
        for (const elem of currNode.children) {
          if (!elem?.isPage) {
            queue.push(elem);
          }
        }
      }
    }
    return null;
  }
}

export {TrieTree, TrieNode};