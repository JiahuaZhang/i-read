import { google } from "googleapis";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 } from 'uuid';
import credentials from '../../credentials.json';
import EPub from 'epub';

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

// var fileId: string;
// var epub: EPub;
export const testSingleEpub = () => new Promise<EPub>((res, rej) => {
  // if (fileId && epub) {
  //   console.log('quick return');
  //   res(epub);
  // } else {
  //   console.log('not quick return');
  // }

  if (global.fileId && global.epub) {
    console.log('quick return');
    res(global.epub);
  } else {
    console.log('global', global.filedId, global.epub);
  }

  console.log('not quick return');
  const fileId = '1eUKzPZles1YrZqCT3-CXawsBXn110rBd';
  global.fileId = fileId;
  drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }).then(response => {

    const filepath = path.join(os.tmpdir(), v4());
    const writeStream = fs.createWriteStream(filepath);

    // https://github.com/julien-c/epub
    response.data
      // .on('close', () => {
      //   console.log('successfully close');
      // })
      .on('end', async () => {
        // console.log('successfully end');

        const epub = new EPub(filepath);

        epub.on('end', () => {
          // global.epub = epub;
          // console.log('set global', global.fileId, global.epub);
          res(epub);
          // console.log(epub.metadata);
          // console.log(epub.manifest);
          // console.log(epub.spine);
          // console.log(epub.toc);

          // console.log(epub.flow);

          // epub.getImage('image_05725f1e28544823a24f5662c14864ee.jpg', (error, img, mimetype) => {
          //   if (error) throw error;

          //   console.log({ img, mimetype });
          // });

          // epub.getChapterRaw(epub.flow[0].id, (err, text) => {
          //   if (err) throw err;

          //   console.log(text);
          // });

          // epub.getChapter(epub.flow[0].id, (err, text) => {
          //   if (err) throw err;

          //   console.log(text);
          // });
        });

        epub.parse();

      }).pipe(writeStream);

  });
});