import React, { useContext } from 'react';

import './FontSizeConfig.sass';
import { ConfigContext } from './configContext';
import { ConfigType } from './configHook';

interface Props {}

export const FontSizeConfig: React.FC<Props> = () => {
  const { fontSize = 16, dispatch } = useContext(ConfigContext);

  return (
    <div className="fontSize">
      <div
        style={{
          color: fontSize === 8 ? '#80808033' : '#00000080',
          fontSize: fontSize > 8 ? fontSize - 2 : 8
        }}
        onClick={() => {
          if (fontSize > 8) {
            dispatch({ type: ConfigType.update_fontSize, payload: fontSize - 2 });
          }
        }}>
        a
      </div>
      <div style={{ fontSize }}>
        {fontSize}
        <span style={{ fontSize: 13 }}>px</span>
      </div>
      <div
        style={{
          fontSize: fontSize < 72 ? fontSize + 2 : 72,
          color: fontSize === 72 ? '#80808033' : '#000000'
        }}
        onClick={() => {
          if (fontSize < 72) {
            dispatch({ type: ConfigType.update_fontSize, payload: fontSize + 2 });
          }
        }}>
        A
      </div>
    </div>
  );
};
