import {Header} from "./Header";
import {Log} from "./Log";
import {AddressesInputs} from "./AddressInputs";
import {ButtonControls} from "./ButtonControls";

export function LogDisplay() {
    return (
        <div id="LogDisplay">
            <Header/>
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