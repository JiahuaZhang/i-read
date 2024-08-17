import { redirect } from '@remix-run/react';
import { type OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

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
    oauth2Client: new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI)
  };
}

export const getGoogleAuthUrl = () => {
  const scope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive'
  ];

  return redirect(global.google.oauth2Client.generateAuthUrl({ access_type: 'offline', scope, prompt: 'consent' }));
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await global.google.oauth2Client.getToken(code);
  console.log('user login with tokens:');
  console.log(tokens);
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