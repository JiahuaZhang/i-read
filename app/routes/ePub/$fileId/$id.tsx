import { type LoaderFunction, type LinksFunction } from "@remix-run/node";
import { useRecoilValue } from "recoil";
import { useLoaderData } from "@remix-run/react";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";
import { bookConfigState } from "~/utils/state/book.config";
import arialFont from "/public/font/Arial/font.css";
import fangZhengFont from "/public/font/FangZheng/font.css";
import georgiaFont from "/public/font/Georgia/font.css";
import helveticaFont from "/public/font/Helvetica/font.css";
import tahomaFont from "/public/font/Tahoma/font.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: arialFont },
    { rel: "stylesheet", href: fangZhengFont },
    { rel: "stylesheet", href: georgiaFont },
    { rel: "stylesheet", href: helveticaFont },
    { rel: "stylesheet", href: tahomaFont },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

export default function () {
  const html = useLoaderData();
  const { fontSize, fontFamily } = useRecoilValue(bookConfigState);

  return (
    <main>
      <PageNavigationBar />
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ fontSize, fontFamily }}
      />
    </main>
  );
}
