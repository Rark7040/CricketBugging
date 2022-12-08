import {PageProps} from "../Props";
import {PagesEnum} from "../PagesEnum";
import {TogglePageButton} from "../TogglePageButton";

export function Setting(props: PageProps) {
    return (
        <div id="Setting">
            hoge
            <TogglePageButton page={PagesEnum.LOG_DISPLAY} btn_txt="return"/>
        </div>
    );
}