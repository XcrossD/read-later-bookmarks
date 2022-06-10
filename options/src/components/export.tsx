import { Button, Dialog, FormGroup, H1, InputGroup, Intent } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";

interface IPocket {
  access_token?: string;
  username?: string;
}

interface IInstapaper {
  username?: string;
  password?: string;
}

interface LoginDialogBodyProps {
  handleClose: Function;
}

const POCKET_REQUEST_URL = 'https://getpocket.com/v3/oauth/request';
const POCKET_AUTHORIZE_URL = 'https://getpocket.com/v3/oauth/authorize';
const INSTAPAPER_AUTHORIZE_URL = 'https://www.instapaper.com/api/authenticate';
const re = /access_token=(.+)&username=(.+)/g;

const LoginDialogBody = (props: LoginDialogBodyProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleInstapaperConnect = () => {
    const instapaperAuth = async () => {
      const requestUrl = `${INSTAPAPER_AUTHORIZE_URL}?username=${username}&password=${password}`;
      const requestResponse = await fetch(requestUrl);
      if (requestResponse.status === 200) {
        setError('');
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const newInstapaperData = {
          username,
          password: passwordHash
        }
        await chrome.storage.local.set({ instapaper: newInstapaperData });
        props.handleClose();
      } else if (requestResponse.status === 403) {
        setError('Invalid username or password');
      } else {
        setError('The service encountered an error. Please try again later.');
      }
    };
    instapaperAuth();
  }
  
  return (
    <div className="login-container">
      <FormGroup
        inline
        label="Username"
        labelFor="username-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="username-input"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
      </FormGroup>
      <FormGroup
        inline
        label="Password"
        labelFor="password-input"
        labelInfo="(required)"
      >
        <InputGroup
          id="password-input"
          placeholder="Password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormGroup>
      <span className="error-message">{error}</span>
      <Button
        text="Login"
        intent={Intent.SUCCESS}
        onClick={handleInstapaperConnect}
      />
    </div>
  );
}

const ButtonWithLoginDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleButtonClick = React.useCallback(() => setIsOpen(!isOpen), []);
  const handleClose = React.useCallback(() => setIsOpen(false), []);
  
  return (
    <>
      <Button
        icon="log-in"
        onClick={handleButtonClick}
        text="Connect to Instapaper"
      />
      <Dialog
        title="Login to Instapaper"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <LoginDialogBody
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
};

const ExportSettings = () => {
  const [pocketData, setPocketData] = useState<IPocket>({});
  const [pocketLoading, setPocketLoading] = useState(false);
  const [pocketLoggedIn, setPocketLoggedIn] = useState(false);
  const [instapaperData, setInstapaperData] = useState<IInstapaper>({});
  const [instapaperLoggedIn, setInstapaperLoggedIn] = useState(false);

  const handlePocketConnect = () => {
    const pocketAuth = async () => {
      setPocketLoading(true);
      const redirectUri = chrome.identity.getRedirectURL();
      const requestResponse = await fetch(POCKET_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "consumer_key": process.env.REACT_APP_POCKET_CONSUMER_KEY,
          'redirect_uri': redirectUri
        })
      });
      const requestData = await requestResponse.text();
      const requestToken = requestData.slice(5);
      const authUrl = `https://getpocket.com/auth/authorize?request_token=${requestToken}&redirect_uri=${redirectUri}`;
      chrome.identity.launchWebAuthFlow({ interactive: true, url: authUrl } , async (responseUrl) => {
        const authorizeResponse = await fetch(POCKET_AUTHORIZE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'consumer_key': process.env.REACT_APP_POCKET_CONSUMER_KEY,
            'code': requestToken
          })
        })
        const authorizeData = await authorizeResponse.text();
        const matchArray: RegExpMatchArray = [...authorizeData.matchAll(re)][0];
        const newPocketData: IPocket = {
          access_token: String(matchArray[1]),
          username: decodeURIComponent(String(matchArray[2]))
        };
        chrome.storage.local.set({ pocket: newPocketData }, () => {
          setPocketLoading(false);
        });
      });
    };

    // don't auth if logged in
    pocketAuth();
  };

  const handleLogout = (type: string) => {
    chrome.storage.local.remove(type);
  };

  useEffect(() => {
    chrome.storage.local.get(['pocket'], (result) => {
      if (Object.keys(result).length === 0 || !result.pocket.access_token) {
        setPocketLoggedIn(false);
      } else {
        setPocketData({...result.pocket});
        setPocketLoggedIn(true);
      }
    });

    chrome.storage.local.get(['instapaper'], (result) => {
      if (Object.keys(result).length === 0) {
        setInstapaperLoggedIn(false);
      } else {
        setInstapaperData({...result.instapaper});
        setInstapaperLoggedIn(true);
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      console.log("changes", changes);
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        switch(key) {
          case 'pocket':
            if (newValue) {
              setPocketData(newValue);
              setPocketLoggedIn(true);
            } else {
              setPocketData({});
              setPocketLoggedIn(false);
            }
            break;
          case 'instapaper':
            if (newValue) {
              setInstapaperData(newValue);
              setInstapaperLoggedIn(true);
            } else {
              setInstapaperData({});
              setInstapaperLoggedIn(false);
            }
            break;
          default:
            break;  
        }
      }
    });
  }, []);

  return (
    <React.Fragment>
      <H1 className="title">Export Settings</H1>
      <FormGroup
        disabled={false}
        inline={true}
        label="Pocket account"
      >
        <Button
          icon={pocketLoggedIn ? 'tick' : 'log-in'}
          onClick={handlePocketConnect}
          text={pocketLoggedIn ? `Connected to Pocket account: ${pocketData.username}` : 'Connect to Pocket'}
          loading={pocketLoading}
        />
        {pocketLoggedIn && (
          <Button
            icon="log-out"
            text="Logout"
            onClick={() => handleLogout('pocket')}
          />
        )}
      </FormGroup>
      <FormGroup
        disabled={false}
        inline={true}
        label="Instapaper account"
      >
        {instapaperLoggedIn ? (
          <>
            <Button
              icon="tick"
              text={`Connected to Instapaper account: ${instapaperData.username}`}
            />
            <Button
              icon="log-out"
              text="Logout"
              onClick={() => handleLogout('instapaper')}
            />
          </>
        ) : (
          <ButtonWithLoginDialog />
        )}
      </FormGroup>
    </React.Fragment>
  )  
}

export default ExportSettings;