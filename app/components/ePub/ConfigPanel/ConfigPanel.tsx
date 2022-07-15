import { FontFamilyConfig } from "./FontFamilyConfig";
import { FontSizeConfig } from "./FontSizeConfig";

export const ConfigPanel = () => {
  return (
    <div>
      <FontSizeConfig />
      <FontFamilyConfig />

      {/* reset button */}
    </div>
  );
};
