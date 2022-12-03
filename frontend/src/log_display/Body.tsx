import {AddressesInputs} from "./AddressInputs";
import {Log} from "./Log";
import {ButtonControls} from "./ButtonControls";
import "./css/Body.css";
import {Info} from "./Info";

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
        </div>
    );
}