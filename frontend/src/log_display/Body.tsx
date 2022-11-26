import {AddressesInputs} from "./AddressInputs";
import {Log} from "./Log";
import {ButtonControls} from "./ButtonControls";

export function Body() {
    return (
        <div id="Body">
            <div className="log-flex">
                <div className="info">
                    <AddressesInputs/>
                </div>
                <div className="controls">
                    <Log/>
                    <ButtonControls/>
                </div>
            </div>
        </div>
    );
}