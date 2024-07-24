"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

// Bileşeni dinamik olarak yükle
const CreateWalletForm = () => {
  let sdk;

  useEffect(() => {
    sdk = new W3SSdk();
  }, []);

  const getInitialState = (key, defaultValue) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  };

  const [appId, setAppId] = useState(() => getInitialState("appId", "someAppId"));
  const [userToken, setUserToken] = useState(() => getInitialState("userToken", "someUserToken"));
  const [encryptionKey, setEncryptionKey] = useState(() => getInitialState("encryptionKey", "someEncryptionKey"));
  const [challengeId, setChallengeId] = useState(() => getInitialState("challengeId", "someChallengeId"));

  const onChangeHandler = useCallback(
    (setState, key) => (e) => {
      const value = e.target.value;
      setState(value);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    },
    []
  );

  const onSubmit = useCallback(() => {
    sdk.setAppSettings({ appId });
    sdk.setAuthentication({ userToken, encryptionKey });

    sdk.execute(challengeId, (error, result) => {
      if (error) {
        toast.error(`Error: ${error?.message ?? "Error!"}`);
        return;
      }
      toast.success(`Challenge: ${result?.type}, Status: ${result?.status}`);
    });
  }, [appId, userToken, encryptionKey, challengeId]);

  return (
    <div className="p-4 bg-white mx-12 rounded">
      <div className="grid grid-cols-5">
        <div>
          <TextField
            label="App Id"
            onChange={onChangeHandler(setAppId, "appId")}
            value={appId}
          />
        </div>
        <div>
          <TextField
            label="User Token"
            onChange={onChangeHandler(setUserToken, "userToken")}
            value={userToken}
          />
        </div>
        <div>
          <TextField
            label="Encryption Key"
            onChange={onChangeHandler(setEncryptionKey, "encryptionKey")}
            value={encryptionKey}
          />
        </div>
        <div>
          <TextField
            label="Challenge Id"
            onChange={onChangeHandler(setChallengeId, "challengeId")}
            value={challengeId}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button variant="contained" color="success" onClick={onSubmit}>
            Verify Challenge
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// Dinamik olarak yüklenecek bileşeni oluşturun
const DynamicCreateWalletForm = dynamic(() => Promise.resolve(CreateWalletForm), { ssr: false });

export default DynamicCreateWalletForm;
