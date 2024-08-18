import { redirect } from '@remix-run/react';
import { Credentials, type OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export type GoogleUser = {
  email: string;
  name: string;
  picture: string;
  credentials?: Credentials;
};

let oauth2Client: OAuth2Client | null = null;
if (!oauth2Client) {
  oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
}

export const getGoogleAuthUrl = () => {
  const scope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive'
  ];

  return redirect(oauth2Client.generateAuthUrl({ access_type: 'offline', scope, prompt: 'consent' }));
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const decoded = jwtDecode<{ [key: string]: string; } & JwtPayload>(tokens.id_token!);
  const { email = '', name = '', picture = '' } = decoded;
  return { email, name, picture, credentials: tokens } as GoogleUser;
};