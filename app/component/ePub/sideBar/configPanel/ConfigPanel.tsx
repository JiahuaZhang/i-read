import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { bookConfigAtom, defaultBookConfig } from '~/util/state/book.config';
import { FontFamilyConfig } from './FontFamilyConfig';
import { FontSizeConfig } from './FontSizeConfig';

export const ConfigPanel = () => {
  const setConfg = useSetAtom(bookConfigAtom);
  const [isConfirmDeleting, setIsConfirmDeleting] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocus = (event: MouseEvent) => {
      if (!divRef.current?.contains(event.target as Node)) {
        setIsConfirmDeleting(false);
      }
    };
    window.addEventListener("click", handleFocus);

    return () => window.removeEventListener("click", handleFocus);
  }, []);

  return (
    <div>
      <FontSizeConfig />
      <FontFamilyConfig />

      <div className="mt-2 grid grid-flow-col place-items-center" ref={divRef}>
        <Button
          className="rounded bg-blue-600 text-white"
          onClick={() => setConfg((prev) => ({ ...prev, config: defaultBookConfig.config }))}
        >
          Reset
        </Button>

        {!isConfirmDeleting && (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              setIsConfirmDeleting(true);
            }}
            className="inline-grid grid-flow-col place-items-center rounded bg-orange-500 text-white hover:border-orange-500 hover:text-orange-500"
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        )}

        {isConfirmDeleting && (
          <Button
            onClick={() => {
              setConfg(defaultBookConfig);
              setIsConfirmDeleting(false);
            }}
            className="inline-grid grid-flow-col place-items-center rounded bg-red-500 text-white hover:border-red-500 hover:text-red-500"
            icon={<DeleteOutlined />}
          >
            Confirm Delete
          </Button>
        )}
      </div>
    </div>
  );
};
