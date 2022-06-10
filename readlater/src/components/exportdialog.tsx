import { Button, Classes, Dialog, IToastProps, Toaster } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPocket, IPocket } from "../features/pocket/pocketSlice";
import pocketLogo from '../images/pocket.png';

interface IExportButtonWithDialog {
  node: chrome.bookmarks.BookmarkTreeNode;
  toaster: Toaster | null;
}

interface IDialogBody {
  node: chrome.bookmarks.BookmarkTreeNode;
  handleClose(): void;
  addToast: Function;
}

const POCKET_ADD_URL = 'https://getpocket.com/v3/add';

const renderDisconnectedHint = (type: string): JSX.Element => {
  return (
    <div className="disconnect-hint">{`Please login to ${type} in options page to continue`}</div>
  )
}

const exportToPocket = (param: {
  node: chrome.bookmarks.BookmarkTreeNode;
  pocket: IPocket;
  handleClose: Function;
  addToast: Function;
}) => {
  const { node, pocket, handleClose, addToast } = param;
  fetch(POCKET_ADD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'url': encodeURIComponent(node.url || ''),
      'consumer_key': process.env.REACT_APP_POCKET_CONSUMER_KEY,
      'access_token': pocket.access_token
    })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('pocket data', data);
      handleClose();
      addToast({ message: `'${node.title}' exported to Pocket` });
    })
    .catch(console.error);
}

const DialogBody = (props: IDialogBody) => {
  const dispatch = useAppDispatch();
  const pocket: IPocket = useAppSelector(state => state.pocket.pocket);
  const pocketStatus: string = useAppSelector(state => state.pocket.status);

  useEffect(() => {
    if (pocketStatus === 'idle') {
      dispatch(fetchPocket());
    }
  }, [pocketStatus, dispatch]);
  
  return (
    <div className={Classes.DIALOG_BODY}>
      <div className="wrapper-export-icon">
        <Popover2
          disabled={Object.keys(pocket).length > 0}
          content={renderDisconnectedHint('Pocket')}
          interactionKind="hover"
          placement="bottom"
        >
          <Button
            minimal
            disabled={Object.keys(pocket).length === 0}
            icon={<img className="export-icon" src={pocketLogo} alt="Pocket Logo" />}
            onClick={() => exportToPocket({
              node: props.node,
              pocket,
              handleClose: props.handleClose,
              addToast: props.addToast
            })}
          />
        </Popover2>
      </div>
    </div>
  );
}

const ExportButtonWithDialog = (props: IExportButtonWithDialog) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleButtonClick = useCallback(() => setIsOpen(!isOpen), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const addToast = (toast: IToastProps) => {
    props.toaster?.show(toast);
  }
  
  return (
    <>
      <Button
        icon="export"
        className={Classes.BUTTON}
        onClick={handleButtonClick}
      />
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title={"Export to"}  
      >
        <DialogBody 
          node={props.node}
          handleClose={handleClose}
          addToast={addToast}
        />
      </Dialog>
    </>
  )
}

export default ExportButtonWithDialog;