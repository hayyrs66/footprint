import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";

// const fs = require("fs").promises;
// const path = require("path");
// const process = require("process");
// const { authenticate } = require("@google-cloud/local-auth");
//const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://mail.google.com/"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "/src/utils/credentials.json"
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function calculateTotalSize(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  let nextPageToken;
  let totalMessages = 0;
  let totalSize = 0;
  let pageCount = 0;

  do {
    const res = await gmail.users.messages.list({
      userId: "me",
      maxResults: 100,
      pageToken: nextPageToken,
      fields: "nextPageToken,messages(id,sizeEstimate)",
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log("No messages found.");
      return;
    }

    console.log(messages.length);

    for (const message of messages) {
      const messageInfo = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      });
      totalSize += messageInfo.data.sizeEstimate;
      console.log("- Total size of message:", totalSize, "bytes");
    }

    nextPageToken = res.data.nextPageToken;
    pageCount++;
  } while (nextPageToken);
}

authorize().then(calculateTotalSize).catch(console.error);
