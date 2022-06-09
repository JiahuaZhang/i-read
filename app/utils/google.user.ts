import { type OAuth2Client } from 'google-auth-library';
import { google, } from 'googleapis';
import jwtDecode, { type JwtPayload } from 'jwt-decode';
import { redirect } from 'remix';
import keys from '../../oauth2.keys.json.json';

export type GoogleUser = {
  email: string;
  name: string;
  picture: string;
  expiration: Date;
  access_token: string;
  refresh_token: string;
};

declare global {
  var google: {
    oauth2Client: OAuth2Client;
  };
}

if (!global.google) {
  global.google = {
    oauth2Client: new google.auth.OAuth2(keys.web.client_id, keys.web.client_secret, keys.web.redirect_uris[0])
  };
}

export const getGoogleAuthUrl = () => {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive'
  ];

  return redirect(global.google.oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes }));
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await global.google.oauth2Client.getToken(code);
  global.google.oauth2Client.setCredentials(tokens);
  const decoded = jwtDecode<{ [key: string]: string; } & JwtPayload>(tokens.id_token!);
  const { email = '', name = '', picture = '' } = decoded;
  return {
    email,
    name,
    picture,
    access_token: tokens.access_token || '',
    refresh_token: tokens.refresh_token || '',
    expiration: new Date(tokens.expiry_date!)
  } as GoogleUser;
};

export const getRootChildren = async () => {
  const drive = google.drive({ version: 'v2' });
  const { token } = await global.google.oauth2Client.getAccessToken();
  return (await drive.children.list({ oauth_token: token!, folderId: 'root' })).data;
};

export const getFilesByid = async (fileId: string) => {
  const drive = google.drive({ version: 'v3' });
  const { token } = await global.google.oauth2Client.getAccessToken();
  return (await drive.files.get({ oauth_token: token!, fileId })).data;
};