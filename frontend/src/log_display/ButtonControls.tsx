import {Scroll} from "./function/Scroll";
import {KillGopherTunnel, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {useRecoilState} from "recoil";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {LocalAddressAtom} from "./recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./recoil/atom/RemoteAddressAtom";
import "./css/ButtonControls.css";

export function ButtonControls() {
    const [localAddr] = useRecoilState(LocalAddressAtom);
    const [remoteAddr] = useRecoilState(RemoteAddressAtom);
    const [auto_scroll, setAutoScroll] = useRecoilState(AutoScrollAtom);
    const updateAutoScroll = () => setAutoScroll(!auto_scroll);

    return (
        <div id="ButtonControls">
            <div className="button-controls">
                <button className="btn" onClick={() => RunGopherTunnel(localAddr, remoteAddr)}>Start</button>
                <button className="btn" onClick={() => KillGopherTunnel()}>Kill</button>
                <button className="btn" onClick={() => Scroll("log-container")}>Scroll</button>
                <button className="btn" onClick={() => updateAutoScroll()}>ToggleAutoScroll</button>
            </div>
        </div>
    );
}