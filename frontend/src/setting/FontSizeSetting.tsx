import {useRecoilState} from "recoil";
import {FontSizeSettingAtom} from "./recoil/atom/FontSizeSettingAtom";

export function Setting() {
    const [font_size, setFontSize] = useRecoilState(FontSizeSettingAtom);

    return (
        <div id="FontSizeSetting">
            <div className="address-label">LocalAddress</div>
            <input id="font_size" className="input" autoComplete="off" name="input" type="number"/>
        </div>
    );
}