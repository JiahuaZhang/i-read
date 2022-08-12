import { CloseCircleFilled } from '@ant-design/icons';
import { type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Modal, notification } from 'antd';
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
  const [display, setDisplay] = useState(ColorPanelDisplay.off);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [zoomInImg, setZoomInImg] = useState('');
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  useEscape(panelRef, () => setDisplay(ColorPanelDisplay.off));

  return (
    <main className='h-full min-h-0 overflow-y-auto relative' ref={containerRef}>
      <PageNavigationBar forwardRef={navigationRef} />
      <div
        className={`${chinseFontFamily} ${englishFontFamily}`}
        style={{ fontSize }}
        dangerouslySetInnerHTML={{ __html: html }}
        onDoubleClick={async (event) => {
          const target = event.target as HTMLElement;

          if (target.tagName === 'IMG') {
            const src = target.getAttribute('src') ?? '';
            setZoomInImg(src);

            const respones = await fetch(src);
            const blob = respones.blob();
            navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob,
              })
            ]);
            notification.success({ message: 'Image copied', duration: 1.5 });
          }
        }}
        onClick={(event) => {
          const target = event.target as HTMLElement;

          if (target.tagName === 'A') {
            // todo, change navigation
            // const href = target.getAttribute('href');
            event.nativeEvent.preventDefault();
          }

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
      <div
        ref={panelRef}
        className="absolute inline-grid grid-flow-col gap-2 rounded bg-orange-50 p-2"
        style={{ ...position, display }}
      >
        {default_highlight_colors.map((color) => (
          <span
            key={color}
            className={`${color} inline-block h-6 w-6 cursor-pointer rounded-full`}
          />
        ))}
      </div>;

      <Modal
        visible={Boolean(zoomInImg)}
        footer={null}
        onCancel={() => setZoomInImg("")}
        closeIcon={<CloseCircleFilled className='text-rose-600' />}
      >
        <img className="mt-0" src={zoomInImg} />
      </Modal>;

    </main>
  );
}
