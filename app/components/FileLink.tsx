import { type drive_v3 } from "googleapis";
import { Link } from "remix";

const GOOGLE_EPUB_TYPE = "application/epub+zip";
export const isEpub = (file: drive_v3.Schema$File) =>
  file.mimeType === GOOGLE_EPUB_TYPE;

type Props = {
  file: drive_v3.Schema$File;
};

export const FileLink = (props: Props) => {
  const { file } = props;

  if (isEpub(file)) {
    return <Link to={`/ePub/${file.id}`}>{file.name}</Link>;
  }

  return <span>{file.name}</span>;
};
