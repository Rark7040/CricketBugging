import {ScrollLog} from "./function/ScrollLog";
import {Debug, KillGopherTunnel, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {useRecoilState, useRecoilValue} from "recoil";
import {AutoScrollAtom} from "./atom/AutoScrollAtom";
import {LocalAddressAtom} from "./atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./atom/RemoteAddressAtom";

export function ButtonControls() {
    const [localAddr] = useRecoilValue(LocalAddressAtom);
    const [remoteAddr] = useRecoilValue(RemoteAddressAtom);
    const [auto_scroll, setAutoScroll] = useRecoilState(AutoScrollAtom);
    const updateAutoScroll = () => setAutoScroll(!auto_scroll);

    return (
        <div id="ButtonControls">
            <button className="btn" onClick={() => RunGopherTunnel(localAddr, remoteAddr)}>Start</button>
            <button className="btn" onClick={() => KillGopherTunnel()}>Kill</button>
            <button className="btn" onClick={() => ScrollLog()}>Scroll</button>
            <button className="btn" onClick={() => updateAutoScroll()}>ToggleAutoScroll</button>
            <button className="btn" onClick={() => Debug()}>Debug</button>
        </div>
    );
}