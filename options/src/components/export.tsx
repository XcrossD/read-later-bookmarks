import { Button, FormGroup, H1 } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

interface IPocket {
  access_token: string;
  username: string;
}

const POCKET_CONSUMER_KEY = '';
const POCKET_REQUEST_URL = 'https://getpocket.com/v3/oauth/request';
const POCKET_AUTHORIZE_URL = 'https://getpocket.com/v3/oauth/authorize';
const re = /access_token=(.+)&username=(.+)/g;

const ExportSettings = () => {
  const [pocketData, setPocketData] = useState<IPocket>({} as IPocket);
  const [pocketLoading, setPocketLoading] = useState(false);
  const [pocketLoggedIn, setPocketLoggedIn] = useState(false);

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
          "consumer_key": POCKET_CONSUMER_KEY,
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
            'consumer_key': POCKET_CONSUMER_KEY,
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

    chrome.storage.onChanged.addListener((changes) => {
      console.log("changes", changes);
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'pocket') {
          if (newValue) {
            setPocketData(newValue);
            setPocketLoggedIn(true);
          } else {
            setPocketData({} as IPocket);
            setPocketLoggedIn(false);
          }
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
    </React.Fragment>
  )  
}

export default ExportSettings;