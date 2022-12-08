import {AddressesInputs} from "./AddressInputs";
import {Log} from "./Log";
import {ButtonControls} from "./ButtonControls";
import "./css/Body.css";
import {Info} from "./Info";
import {TogglePageButton} from "../TogglePageButton";
import {PagesEnum} from "../PagesEnum";

export function Body() {
    return (
        <div id="Body">
            <div className="log-flex">
                <div className="info">
                    <AddressesInputs/>
                    <Info/>
                </div>
                <div className="controls">
                    <Log/>
                    <ButtonControls/>
                </div>
            </div>
            <TogglePageButton page={PagesEnum.SETTING} btn_txt="Setting"/>
        </div>
    );
}