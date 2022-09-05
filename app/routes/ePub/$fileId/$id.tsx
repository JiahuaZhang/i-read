import { CloseCircleFilled, DeleteFilled } from '@ant-design/icons';
import { type LinksFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Checkbox, Modal, notification } from 'antd';
import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from "recoil";
import { PageNavigationBar } from "~/components/ePub/PageNavigationBar";
import fontCss from "~/styles/font.css";
import { getCurrentEpubChapter } from "~/utils/google.drive.server";
import { useEscape } from '~/utils/hook/useEscape';
import { ImageHighlight } from '~/utils/selection/ImageNote';
import { TextHighlight } from '~/utils/selection/TextNote';
import { bookConfigState } from "~/utils/state/book.config";
import { highlightState } from '~/utils/state/highlight';

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

enum ImagePanelDisplay {
  on = '',
  off = 'none'
}

export default function () {
  const html = useLoaderData();
  const { config: { fontSize, chinseFontFamily, englishFontFamily } } = useRecoilValue(bookConfigState);
  const [highlights, setHighlights] = useRecoilState(highlightState);
  const [colorPanelDisplay, setColorPanelDisplay] = useState(ColorPanelDisplay.off);
  const [imagePanelDisplay, setImagePanelDisplay] = useState(ImagePanelDisplay.off);
  const [recentImage, setRecentImage] = useState<ImageHighlight>();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [zoomInImg, setZoomInImg] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [key, setKey] = useState(0);
  const [highlighter] = useState(() => {
    const highlighter = rangy.createHighlighter();
    default_highlight_colors.forEach(color =>
      highlighter.addClassApplier(rangy.createClassApplier(color))
    );
    return highlighter;
  });
  const containerRef = useRef<HTMLElement>(null);
  const colorPanelRef = useRef<HTMLDivElement>(null);
  const imagePanelRef = useRef<HTMLInputElement | null>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  useEscape(colorPanelRef, () => {
    setColorPanelDisplay(ColorPanelDisplay.off);
    setHighlightIndex(-1);
  });
  useEscape(imagePanelRef, () => setImagePanelDisplay(ImagePanelDisplay.off));

  useEffect(() => {
    if (key === 0) return;

    highlights.forEach(highlight => highlight.highlight(highlighter));
  }, [key]);

  const getPosition = useCallback(
    (panel: HTMLElement, event: MouseEvent) => {
      const maxTop = containerRef.current!.scrollHeight - panel.offsetHeight;
      const top = Math.min(containerRef.current!.scrollTop - navigationRef.current!.offsetHeight + event.pageY, maxTop);
      const maxLeft = containerRef.current!.clientWidth - panel.clientWidth;
      const left = Math.min(event.offsetX, maxLeft);

      return { top, left };
    }, [containerRef.current, navigationRef.current]);

  useEffect(() => {
    document.addEventListener('contextmenu', event => {
      if ((event.target as Element).tagName !== 'IMG') return;

      event.preventDefault();

      const imageHighlight = ImageHighlight.create(highlighter, (event.target) as Node, mainRef.current!);
      setRecentImage(imageHighlight);
      setPosition(getPosition(imagePanelRef.current!, event));
      setImagePanelDisplay(ImagePanelDisplay.on);
    });
  }, []);

  return (
    <main className='h-full min-h-0 overflow-y-auto relative' ref={containerRef}>
      <PageNavigationBar forwardRef={navigationRef} />

      <div
        id='book'
        key={key}
        ref={mainRef}
        className={`${chinseFontFamily} ${englishFontFamily}`}
        style={{ fontSize }}
        dangerouslySetInnerHTML={{ __html: html }}
        onDoubleClick={async (event) => {
          const target = event.target as HTMLElement;
          if (target.tagName !== 'IMG') return;

          const src = target.getAttribute('src') ?? '';
          setZoomInImg(src);
          const blob = await (await fetch(src)).blob();
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob, })]);
          notification.success({ message: 'Image copied', duration: 1.5 });
        }}
        onClick={(event) => {
          if (colorPanelDisplay === ColorPanelDisplay.on) return;

          const target = event.target as HTMLElement;
          if (target.tagName === 'A') {
            // todo, change navigation
            // const href = target.getAttribute('href');
            event.nativeEvent.preventDefault();
            return;
          }

          const selection = window.getSelection();
          if (!selection?.toString()) {
            if (target.tagName !== 'SPAN') return;

            const classNames = [...target.classList];
            if (!classNames.some(name => default_highlight_colors.includes(name))) return;

            const range = rangy.createRange();
            range.selectNode(target);
            const characterRange = highlighter.converter.rangeToCharacterRange(range, mainRef.current!);
            const index = highlights.findIndex(highlight => highlight.contains(characterRange));
            setHighlightIndex(index);
            const current = highlights[index];
            current.toggleSelect(highlighter, document, mainRef.current!);
          }

          event.nativeEvent.stopImmediatePropagation();
          setPosition(getPosition(colorPanelRef.current!, event.nativeEvent));
          setColorPanelDisplay(ColorPanelDisplay.on);
        }}
      />

      <div
        ref={colorPanelRef}
        className="absolute inline-grid grid-flow-col gap-2 rounded bg-orange-50 p-2 items-center"
        style={{ ...position, display: colorPanelDisplay }}
        onMouseDown={event => event.preventDefault()}
      >
        {default_highlight_colors.map((color) => (
          <span
            onClick={() => {
              const cleanup = () => {
                document.getSelection()?.removeAllRanges();
                setColorPanelDisplay(ColorPanelDisplay.off);
              };

              if (highlightIndex !== -1) {
                const currentHighlight = highlights[highlightIndex] as TextHighlight;
                if (currentHighlight.note.className === color) return cleanup();

                const range = currentHighlight.toRange(highlighter, document, mainRef.current!);
                const updateClass = (node: Element) => {
                  if (range.intersectsNode(node)) {
                    if (node.tagName !== 'SPAN') {
                      node.childNodes.forEach(n => updateClass(n as Element));
                    } else {
                      node.className = node.className.replace(currentHighlight.note.className, color);
                    }
                  }
                };

                range.commonAncestorContainer.childNodes.forEach(node => updateClass(node as Element));
                const update = currentHighlight.changeClass(color);
                setHighlights(prev => prev.map(val => val === currentHighlight ? update : val));
                setHighlightIndex(-1);
              } else {
                const textHighlight = TextHighlight.create(highlighter, mainRef.current!, color);
                textHighlight.highlight(highlighter);
                setHighlights(prev => [...prev, textHighlight]);
              }

              cleanup();
            }}
            key={color}
            className={`${color} inline-block h-6 w-6 cursor-pointer rounded-full`}
          />
        ))}
        {highlightIndex !== -1 &&
          <DeleteFilled className='text-fill text-red-600 ml-4 text-xl inline-grid cursor-pointer'
            onClick={() => {
              console.log('to delete');
              setHighlights(prev => prev.filter((_, index) => index !== highlightIndex));
              setColorPanelDisplay(ColorPanelDisplay.off);
              setKey(value => value + 1);
            }}
          />}
      </div>;

      <Checkbox
        className='absolute p-2 bg-slate-50 rounded border-2 border-violet-600'
        style={{ ...position, display: imagePanelDisplay }}
        ref={r => {
          if (!r) return;
          imagePanelRef.current = (r as any).input; // eslint-disable-line
        }}
        onClick={e => e.nativeEvent.stopImmediatePropagation()}
        checked={highlights.some(h => h.equals(recentImage!))}
        onChange={e => {
          if (e.target.checked) {
            setHighlights(prev => [...prev, recentImage!]);
          } else {
            setHighlights(prev => prev.filter(h => !h.equals(recentImage!)));
          }
        }}
      >
        <span onClick={e => e.nativeEvent.stopImmediatePropagation()} >image</span>
      </Checkbox>

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
