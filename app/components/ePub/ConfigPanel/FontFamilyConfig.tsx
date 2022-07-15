import { Radio, Space, Tabs } from "antd";
import { useRecoilState } from "recoil";
import { bookConfigState } from "~/utils/state/book.config";

const default_english_fonts = ["Arial", "Georgia", "Helvetica", "Tahoma"];
const default_chinese_fonts = [
  ["方正黑体", "HeiTi"],
  ["方正书宋", "ShuSong"],
  ["方正仿宋", "FangSong"],
  ["方正楷体", "KaiTi"],
];

export const FontFamilyConfig = () => {
  const [{ chinseFontFamily, englishFontFamily }, setConfig] =
    useRecoilState(bookConfigState);

  return (
    <Tabs centered>
      <Tabs.TabPane tab="English" key="english">
        <Radio.Group
          value={englishFontFamily}
          className="grid w-full place-items-center"
        >
          <Space direction="vertical">
            {default_english_fonts.map((font) => (
              <Radio.Button
                key={font}
                value={font}
                className="w-full text-center"
                style={{ fontFamily: font }}
                onClick={() => {
                  if (font === englishFontFamily) {
                    setConfig((prev) => ({
                      ...prev,
                      englishFontFamily: "",
                      fontFamily: prev.chinseFontFamily,
                    }));
                  } else {
                    setConfig((prev) => ({
                      ...prev,
                      englishFontFamily: font,
                      fontFamily: [font, prev.chinseFontFamily]
                        .filter(Boolean)
                        .join(","),
                    }));
                  }
                }}
              >
                {font}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        <p
          style={{ fontFamily: englishFontFamily }}
          className="px-2 indent-0 text-xl"
        >
          The quick brown fox jumped over the lazy dog
        </p>
      </Tabs.TabPane>
      <Tabs.TabPane tab="中文" key="chinese">
        <Radio.Group
          className="grid w-full place-items-center"
          value={chinseFontFamily}
        >
          <Space direction="vertical">
            {default_chinese_fonts.map((font) => (
              <Radio.Button
                className="w-full text-center"
                key={font[1]}
                value={font[1]}
                style={{ fontFamily: font[1] }}
                onClick={() => {
                  if (font[1] === chinseFontFamily) {
                    setConfig((prev) => ({
                      ...prev,
                      chinseFontFamily: "",
                      fontFamily: prev.englishFontFamily,
                    }));
                  } else {
                    setConfig((prev) => ({
                      ...prev,
                      chinseFontFamily: font[1],
                      fontFamily: [font[1], prev.englishFontFamily]
                        .filter(Boolean)
                        .join(","),
                    }));
                  }
                }}
              >
                {font[0]}
              </Radio.Button>
            ))}
          </Space>
        </Radio.Group>
        <p
          style={{ fontFamily: chinseFontFamily }}
          className="text-center indent-0 text-2xl"
        >
          天地玄黄，宇宙洪荒。
          <br />
          日月盈昃，辰宿列张。
          <br />
          寒来暑往，秋收冬藏。
          <br />
          闰余成岁，律吕调阳。
        </p>
      </Tabs.TabPane>
    </Tabs>
  );
};
