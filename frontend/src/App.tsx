import './css/App.css';
import {LogDisplay} from "./log_display/LogDisplay";
import {MutableSnapshot, RecoilRoot} from "recoil";
import {LocalAddressAtom} from "./log_display/recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./log_display/recoil/atom/RemoteAddressAtom";

const init = ({ set }: MutableSnapshot) => {
    set(LocalAddressAtom, "0.0.0.0:19132");
    set(RemoteAddressAtom, "0.0.0.0:19132");
};

function App() {
    return (
        <RecoilRoot initializeState={init}>
            <div id="App">
                <LogDisplay/>
            </div>
        </RecoilRoot>
    );
}

export default App