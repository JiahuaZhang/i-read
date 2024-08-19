import { CloseCircleFilled, DeleteFilled } from '@ant-design/icons';
import { LoaderFunction } from '@remix-run/node';
import { MetaFunction, useLoaderData, useParams } from '@remix-run/react';
import { Checkbox, Modal, notification } from 'antd';
import { useAtom } from 'jotai';
import _ from 'lodash';
import rangy from 'rangy';
import 'rangy/lib/rangy-classapplier';
import 'rangy/lib/rangy-highlighter';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { getCurrentEpubChapter } from '~/.server/google/drive';
import { PageNavigationBar } from '~/component/ePub/PageNavigationBar';
import '~/component/font.css';
import { getBookConfig, updateBookConfig } from '~/util/database';
import { useEscape } from '~/util/hook/useEscape';
import { ImageHighlight, img2blob } from '~/util/selection/ImageNote';
import { isTextNote, TextHighlight } from '~/util/selection/textNote';
import { bookConfigAtom } from '~/util/state/book.config';
import { highlightAtom, mainKeyAtom } from '~/util/state/highlight';

export const meta: MetaFunction = ({ params: { id } }) => [{ title: `ePub ${id}` }];

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const config = await getBookConfig();
  const html = await getCurrentEpubChapter(id!);
  return { html, config };
};

export const default_highlight_colors = ['bg-red-600', 'bg-amber-400', 'bg-green-400', 'bg-blue-300', 'bg-purple-400', 'bg-pink-400'] as const;

enum ColorPanelDisplay {
  on = 'visible',
  off = 'hidden'
}

enum ImagePanelDisplay {
  on = 'visible',
  off = 'hidden'
}

const Book = () => {
  const { html, config } = useLoaderData<typeof loader>();
  const [bookConfig, setBookConfig] = useAtom(bookConfigAtom);
  const { id = '' } = useParams();
  const [highlights, setHighlights] = useAtom(highlightAtom);
  const [needInitHighlights, setNeedInitHighlights] = useState(true);
  const [colorPanelDisplay, setColorPanelDisplay] = useState(ColorPanelDisplay.off);
  const [imagePanelDisplay, setImagePanelDisplay] = useState(ImagePanelDisplay.off);
  const [recentImage, setRecentImage] = useState<ImageHighlight>();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [zoomInImg, setZoomInImg] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [key, setKey] = useAtom(mainKeyAtom);
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
    // todo, in extreme select case, color panel won't be showing
    setColorPanelDisplay(ColorPanelDisplay.off);
    setHighlightIndex(-1);
  });
  useEscape(imagePanelRef, () => setImagePanelDisplay(ImagePanelDisplay.off));

  useEffect(() => setBookConfig(config), [config]);

  useEffect(() => { updateBookConfig(bookConfig); }, [bookConfig]);

  useEffect(() => {
    if (id !== bookConfig.track.page) {
      setNeedInitHighlights(true);
      setBookConfig(prev => ({ ...prev, track: { ...prev.track, page: id } }));
    }
  }, [id]);

  useEffect(() => {
    const notes = bookConfig.track.notes[id] ?? [];
    const cachedHighlights = notes.map(n => isTextNote(n) ? new TextHighlight(n) : new ImageHighlight(n));
    setHighlights(
      cachedHighlights.map(h => h.hydrate({ highlighter, doc: document, container: mainRef.current! }))
    );

    setNeedInitHighlights(false);
  }, [needInitHighlights]);

  useEffect(() => {
    if (key === 0) return;

    highlights.forEach(highlight => highlight.highlight(highlighter));
  }, [key]);

  useEffect(() => {
    if (needInitHighlights) return;

    const notes = highlights.map(h => h.note);
    setBookConfig(value => {
      const newValue = _.cloneDeep(value);
      if (!notes.length) {
        delete newValue.track.notes[id];
        return newValue;
      }

      newValue.track.notes[id] = notes;
      return newValue;
    });
  }, [highlights, needInitHighlights]);

  const getPosition = useCallback(
    (panel: HTMLElement, event: MouseEvent) => {
      const maxTop = containerRef.current!.scrollHeight - panel.offsetHeight;
      const top = Math.min(containerRef.current!.scrollTop - navigationRef.current!.offsetHeight + event.pageY, maxTop);
      const maxLeft = containerRef.current!.clientWidth - panel.clientWidth;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
      // @ts-ignore:next-line
      const left = Math.min((event.layerX || event.offsetX), maxLeft);

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
        className={`${bookConfig.config.chinseFontFamily} ${bookConfig.config.englishFontFamily} p-4`}
        style={{ fontSize: bookConfig.config.fontSize }}
        dangerouslySetInnerHTML={{ __html: html as string }}
        onDoubleClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.tagName !== 'IMG') return;

          const src = target.getAttribute('src') ?? '';
          setZoomInImg(src);
          navigator.clipboard.write([new ClipboardItem(img2blob(src))]);
          notification.success({ message: 'Image copied', duration: 1.5 });
        }}
        onClick={async (event) => {
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
            if (!default_highlight_colors.some(color => classNames.includes(color))) return;

            const range = rangy.createRange();
            range.selectNode(target);
            const characterRange = highlighter.converter.rangeToCharacterRange(range, mainRef.current!);
            const index = highlights.findIndex(highlight => highlight.contains(characterRange));
            setHighlightIndex(index);
            const current = highlights[index];
            current.toggleSelect({ highlighter, doc: document, container: mainRef.current! });
            await Promise.resolve();
          }

          event.nativeEvent.stopImmediatePropagation();
          setPosition(getPosition(colorPanelRef.current!, event.nativeEvent));
          setImagePanelDisplay(ImagePanelDisplay.off);
          setColorPanelDisplay(ColorPanelDisplay.on);
        }}
      />

      <div
        ref={colorPanelRef}
        className="absolute inline-grid grid-flow-col gap-2 rounded bg-orange-50 p-2 items-center"
        style={{ ...position, visibility: colorPanelDisplay }}
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

                const range = currentHighlight.toRange({ highlighter, doc: document, container: mainRef.current! });
                const updateClass = (node: Element) => {
                  if (!range.intersectsNode(node)) return;

                  if (node.tagName === 'SPAN' && node.className.includes(currentHighlight.note.className)) {
                    node.className = node.className.replace(currentHighlight.note.className, color);
                  } else {
                    node.childNodes.forEach(n => updateClass(n as Element));
                  }
                };

                range.commonAncestorContainer.childNodes.forEach(node => updateClass(node as Element));
                const update = currentHighlight.changeClass(color);
                setHighlights(prev => prev.map(val => val === currentHighlight ? update : val));
                setHighlightIndex(-1);
              } else {
                const textHighlight = TextHighlight.create(highlighter, mainRef.current!, color);
                setHighlights(prev => [...prev, textHighlight].sort((a, b) => a.compareTo(b)));
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
              setHighlights(prev => prev.filter((_, index) => index !== highlightIndex));
              setColorPanelDisplay(ColorPanelDisplay.off);
              setKey(value => value + 1);
            }}
          />}
      </div>;

      <Checkbox
        className='absolute p-2 bg-slate-50 rounded border-2 border-violet-600'
        style={{ ...position, visibility: imagePanelDisplay }}
        ref={r => {
          if (!r) return;
          imagePanelRef.current = (r as any).input; // eslint-disable-line
        }}
        onClick={e => e.nativeEvent.stopImmediatePropagation()}
        checked={highlights.some(h => h.equals(recentImage!))}
        onChange={e => {
          if (e.target.checked) {
            setHighlights(prev => [...prev, recentImage!].sort((a, b) => a.compareTo(b)));
          } else {
            setHighlights(prev => prev.filter(h => !h.equals(recentImage!)));
          }
        }}
      >
        <span onClick={e => e.nativeEvent.stopImmediatePropagation()} >image</span>
      </Checkbox>

      <Modal
        open={Boolean(zoomInImg)}
        footer={null}
        onCancel={() => setZoomInImg("")}
        closeIcon={<CloseCircleFilled className='text-rose-600' />}
      >
        <img className="mt-0" src={zoomInImg} />
      </Modal>;

    </main>
  );
};

export default () => <ClientOnly>{() => <Book />}</ClientOnly>;