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

export const getEPubToc = async (epub: EPub, id: string) => {
  console.log({ id });

  epub.getFile('ncx', (err, text) => {
    if (err) {
      console.log('fail get chapter');
    }

    // console.log(text);
    const buffer = Buffer.from(text).toString();
    console.log(buffer);
  });

  return '';
};