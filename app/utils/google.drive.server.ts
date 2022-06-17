import { google } from 'googleapis';

export const getFolderFiles = async (folder: string) => {
  const drive = google.drive({ version: 'v3' });
  const { token } = await global.google.oauth2Client.getAccessToken();
  return (await drive.files.list({ oauth_token: token!, q: `'${folder}' in parents` })).data;
};

export const getAllParents = async (folder: string) => {
  const drive = google.drive({ version: 'v3' });
  const { token } = await global.google.oauth2Client.getAccessToken();

  const list = [];

  let fileId = folder;
  while (true) {
    const { name, id, parents } = (await drive.files.get({ oauth_token: token!, fileId, fields: 'name,parents, id' })).data;
    list.push({ name, id });
    if (!parents) break;

    fileId = parents[0]!;
  }

  list.shift();
  return list.reverse();
};