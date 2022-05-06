import { google } from "googleapis";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 } from 'uuid';
import credentials from '../../credentials.json';
import EPub from 'epub';
import parse from 'node-html-parser';
import { type RawAttributes } from 'node-html-parser/dist/nodes/html';

// https://www.google.com/search?q=esm+declare+global+variable&oq=esm+declare+global+vari&aqs=chrome.1.69i57j33i160j33i299.4647j0j9&sourceid=chrome&ie=UTF-8

const scopes = [
  'https://www.googleapis.com/auth/drive'
];
const auth = new google.auth.JWT(
  credentials.client_email, undefined, credentials.private_key, scopes
);
const drive = google.drive({ version: "v3", auth });

export const testDrive = () => {
  drive.files.list({
    fields: 'files(id, name, mimeType, owners, webContentLink)'
    // fields: '*'
  }, (err, res) => {
    if (err) throw err;

    const files = res?.data.files;

    if (files?.length) {
      files.forEach(file => {
        console.log(file);
      });

    }
  });
};

declare global {
  var cache: {
    filedId?: string;
    epub?: EPub;
  };
}

if (!global.cache) {
  global.cache = {};
}

export const testSingleEpub = async () => new Promise<EPub>((res, rej) => {
  if (global.cache.filedId && global.cache.epub) {
    console.log('quick return');
    res(global.cache.epub);
    return;
  }

  console.log('not quick return');
  const fileId = '1eUKzPZles1YrZqCT3-CXawsBXn110rBd';
  global.cache.filedId = fileId;
  drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }).then(response => {

    const filepath = path.join(os.tmpdir(), v4());
    const writeStream = fs.createWriteStream(filepath);

    // https://github.com/julien-c/epub
    response.data
      .on('end', async () => {
        const epub = new EPub(filepath);
        global.cache.epub = epub;

        epub.on('end', () => {
          res(epub);
        });

        epub.parse();

      }).pipe(writeStream);

  });
});

const getImageAsBase64 = async (epub: EPub, path: string) => {
  path = path.replace('../', '');
  const value = Object.values(epub.manifest).find((manifest) =>
    manifest.href.includes(path)
  );
  const { id } = value;

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

  const root = parse(text);

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

  return root.toString();
};