import { type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRecoilValue } from "recoil";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import fontCss from "~/styles/font.css";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";
import { bookConfigState } from "~/utils/state/book.config";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontCss }
];

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

export default function () {
  const html = useLoaderData();
  const { config: { fontSize, chinseFontFamily, englishFontFamily } } = useRecoilValue(bookConfigState);

  return (
    <main className='h-full min-h-0 overflow-y-auto'>
      <PageNavigationBar />
      <div
        className={`${chinseFontFamily} ${englishFontFamily}`}
        style={{ fontSize }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
