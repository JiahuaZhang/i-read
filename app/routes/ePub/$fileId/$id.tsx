import { type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef, useState } from 'react';
import { useRecoilValue } from "recoil";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import fontCss from "~/styles/font.css";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";
import { useEscape } from '~/utils/hook/useEscape';
import { bookConfigState } from "~/utils/state/book.config";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: fontCss }
];

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  return getCurrentEpubChapter(id!);
};

const default_highlight_colors = ['bg-red-600', 'bg-amber-400', 'bg-green-400', 'bg-blue-500', 'bg-purple-400', 'bg-pink-400'];

enum ColorPanelDisplay {
  on = 'inline-grid',
  off = 'none'
}

export default function () {
  const html = useLoaderData();
  const { config: { fontSize, chinseFontFamily, englishFontFamily } } = useRecoilValue(bookConfigState);
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [display, setDisplay] = useState(ColorPanelDisplay.off);
  useEscape(panelRef, () => setDisplay(ColorPanelDisplay.off));

  return (
    <main className='h-full min-h-0 overflow-y-auto relative' ref={containerRef}>
      <PageNavigationBar forwardRef={navigationRef} />
      <div
        className={`${chinseFontFamily} ${englishFontFamily}`}
        style={{ fontSize }}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(event) => {
          const selection = window.getSelection();
          if (!selection?.toString()) return;

          event.nativeEvent.stopImmediatePropagation();
          const maxTop = containerRef.current!.scrollHeight - panelRef.current!.offsetHeight;
          const top = Math.min(containerRef.current!.scrollTop - navigationRef.current!.offsetHeight + event.pageY, maxTop);
          const maxLeft = containerRef.current!.clientWidth - panelRef.current!.clientWidth;
          const left = Math.min(event.pageX, maxLeft);
          setPosition({ top, left });
          setDisplay(ColorPanelDisplay.on);
        }}
      />
      <div ref={panelRef} className='absolute inline-grid grid-flow-col gap-2 bg-orange-50 p-2 rounded'
        style={{ ...position, display }}>
        {
          default_highlight_colors.map(color => <span key={color} className={`${color} w-6 h-6 inline-block rounded-full cursor-pointer`} />)
        }
      </div>
    </main>
  );
}
