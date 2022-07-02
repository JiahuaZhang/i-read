import EPub from 'epub';
import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';
import os from 'os';
import parse from 'node-html-parser';
import { type RawAttributes } from 'node-html-parser/dist/nodes/html';

declare global {
  var cache: {
    filedId?: string;
    epub?: EPub;
  };
}

if (!global.cache) {
  global.cache = {};
}

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

export const getEPub = async (fileId: string) => {
  if (global.cache.filedId === fileId && global.cache.epub) {
    console.log('filedId', fileId, 'cached id', global.cache.filedId);
    return global.cache.epub;
  }

  const headers = await global.google.oauth2Client.getRequestHeaders();
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: new Headers({ Authorization: headers.Authorization }) });

  const filepath = path.join(os.tmpdir(), 'current.epub');
  const writeStream = fs.createWriteStream(filepath);
  response.body?.pipe(writeStream);
  await new Promise(res => writeStream.on('close', res));

  const epub = new EPub(filepath);
  epub.parse();
  await new Promise(res => epub.on('end', res));

  global.cache.filedId = fileId;
  global.cache.epub = epub;
  return epub;
};

const path2id = async (epub: EPub, path: string) => {
  path = path.replace(/\.\.\//g, '');
  const value = Object.values(epub.manifest).find((manifest) =>
    manifest.href.includes(path)
  );
  return value.id;
};

const getImageAsBase64 = async (epub: EPub, path: string) => {
  const id = await path2id(epub, path);
  const imageBuffer = await new Promise<Buffer>((res) => {
    epub.getImage(id, (err, data) => {
      res(data);
    });
  });

  return Buffer.from(imageBuffer).toString("base64");
};

export const getEPubChater = async (epub: EPub, flow: string) => {
  const text = await new Promise<string>((res) => {
    epub.getChapterRaw(flow, (err, text) => {
      res(text);
    });
  });

  let root = parse(text);

  const resolveImage = async (rawAttributes: RawAttributes) => {
    const xlink = rawAttributes['xlink:href'];
    if (!xlink) return rawAttributes;

    const base64 = await getImageAsBase64(epub, xlink);
    delete rawAttributes['xlink:href'];
    rawAttributes['href'] = `data:image/jpeg;base64,${base64}`;
    return rawAttributes;
  };

  const resolveImg = async (rawAttributes: RawAttributes) => {
    const src = rawAttributes.src;
    if (!src) return rawAttributes;

    const base64 = await getImageAsBase64(epub, src);
    rawAttributes.src = `data:image/jpeg;base64,${base64}`;
    return rawAttributes;
  };

  const resolveCss = async (rawAttributes: RawAttributes) => {
    if (rawAttributes.rel !== 'stylesheet') return '';

    const id = await path2id(epub, rawAttributes.href);

    const buffer = await new Promise<Buffer>(res => {
      epub.getFile(id, (err, data) => {
        res(data);
      });
    });

    return `<style>${Buffer.from(buffer).toString()}</style>`;
  };

  const images = root.querySelectorAll("image");
  for (const image of images) {
    const { rawAttributes } = image;
    image.setAttributes(await resolveImage(rawAttributes));
  }

  const imgs = root.querySelectorAll('img');
  for (const img of imgs) {
    const { rawAttributes } = img;
    img.setAttributes(await resolveImg(rawAttributes));
  }

  const links = root.querySelectorAll('link');
  for (const css of links) {
    const { attributes } = css;
    const newNode = parse(await resolveCss(attributes));
    css.replaceWith(newNode);
  }

  return root.toString();
};

export const getCurrentEpubChapter = async (id: string) => getEPubChater(global.cache.epub!, id);