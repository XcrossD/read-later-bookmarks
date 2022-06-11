import { Button, Classes, Dialog, IToastProps, Toaster } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useCallback, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchInstapaper, IInstapaper } from "../features/credentials/instapaperSlice";
import { fetchPocket, IPocket } from "../features/credentials/pocketSlice";
import pocketLogo from '../images/pocket.png';
import instapaperLogo from '../images/instapaper.png';

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
const INSTAPAPER_ADD_URL = 'https://www.instapaper.com/api/add';

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
  setError: Function;
}) => {
  const { node, pocket, handleClose, addToast, setError } = param;
  fetch(POCKET_ADD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'url': node.url,
      'consumer_key': process.env.REACT_APP_POCKET_CONSUMER_KEY,
      'access_token': pocket.access_token
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      return response.text().then(text => {
        const headers = response.headers.entries();
        let result = headers.next();
        while (!result.done) {
          const [key, value] = result.value;
          if (key === 'x-error') {
            text += ` (${value})`;
            break;
          }
          result = headers.next();
        }
        setError(text);
        throw new Error(text);
      });
    })
    .then((data) => {
      // console.log('pocket data', data);
      handleClose();
      addToast({ message: `'${node.title}' exported to Pocket` });
    })
    .catch(console.error);
}

const exportToInstapaper = (param: {
  node: chrome.bookmarks.BookmarkTreeNode;
  instapaper: IInstapaper;
  handleClose: Function;
  addToast: Function;
  setError: Function;
}) => {
  const { node, instapaper, handleClose, addToast, setError } = param;
  const passwordBytes = CryptoJS.AES.decrypt(instapaper.password || '', process.env.REACT_APP_SECRET_PASSPHRASE || '');
  const password = passwordBytes.toString(CryptoJS.enc.Utf8);
  const url = `${INSTAPAPER_ADD_URL}?url=${node.url}`;
  fetch(url, {
    headers: {
      'Authorization': 'Basic ' + btoa(instapaper.username + ":" + password)
    }
  })
    .then((response) => {
      switch(response.status) {
        case 201:
          handleClose();
          addToast({ message: `'${node.title}' exported to Instapaper` });
          break;
        case 400:
          console.log('Bad request or exceeded the rate limit.');
          setError(`${response.status} Bad request or exceeded the rate limit.'`);
          break;
        case 403:
          console.log('Invalid username or password.');
          setError(`${response.status} Invalid username or password.`);
          break;
        case 500:
          console.log('The service encountered an error. Please try again later.');
          setError(`${response.status} The service encountered an error. Please try again later.`);
          break;
        default:
          break;
      }
    })
    .catch(console.error);
}

const DialogBody = (props: IDialogBody) => {
  const dispatch = useAppDispatch();
  const pocket: IPocket = useAppSelector(state => state.pocket.pocket);
  const pocketStatus: string = useAppSelector(state => state.pocket.status);
  const instapaper: IInstapaper = useAppSelector(state => state.instapaper.instapaper);
  const instapaperStatus: string = useAppSelector(state => state.instapaper.status);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (pocketStatus === 'idle') {
      dispatch(fetchPocket());
    }
  }, [pocketStatus, dispatch]);

  useEffect(() => {
    if (instapaperStatus === 'idle') {
      dispatch(fetchInstapaper());
    }
  }, [instapaperStatus, dispatch]);
  
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
              addToast: props.addToast,
              setError
            })}
          />
        </Popover2>
        <Popover2
          disabled={Object.keys(pocket).length > 0}
          content={renderDisconnectedHint('Instapaper')}
          interactionKind="hover"
          placement="bottom"
        >
          <Button
            minimal
            disabled={Object.keys(instapaper).length === 0}
            icon={<img className="export-icon" src={instapaperLogo} alt="Instapaper Logo" />}
            onClick={() => exportToInstapaper({
              node: props.node,
              instapaper,
              handleClose: props.handleClose,
              addToast: props.addToast,
              setError
            })}
          />
        </Popover2>
      </div>
      {error.length > 0 && (
        <div className={"export-dialog__error-message"}>
          {`Error: ${error}`}
          <br />
          If this error persists, please report it to <a href="https://github.com/XcrossD/read-later-bookmarks/issues/new" target="_blank">Github</a> or <a href="mailto:readlaterbookmarks@gmail.com">send an email</a>.
        </div>
      )}
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