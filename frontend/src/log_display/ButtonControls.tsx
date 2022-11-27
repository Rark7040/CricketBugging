import {ScrollLog} from "./function/ScrollLog";
import {Debug, KillGopherTunnel, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {useRecoilState, useRecoilValue} from "recoil";
import {AutoScrollAtom} from "./atom/AutoScrollAtom";
import {LocalAddressAtom} from "./atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./atom/RemoteAddressAtom";
import {DebugAtom} from "./atom/DebugAtom";
import {LogAtom} from "./atom/LogAtom";

export function ButtonControls() {
    const [localAddr] = useRecoilValue(LocalAddressAtom);
    const [remoteAddr] = useRecoilValue(RemoteAddressAtom);
    const [auto_scroll, setAutoScroll] = useRecoilState(AutoScrollAtom);
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const [log, setLog] = useRecoilState(LogAtom);
    const updateAutoScroll = () => setAutoScroll(!auto_scroll);

    return (
        <div id="ButtonControls">
            <button className="btn" onClick={() => RunGopherTunnel(localAddr, remoteAddr)}>Start</button>
            <button className="btn" onClick={() => KillGopherTunnel()}>Kill</button>
            <button className="btn" onClick={() => ScrollLog()}>Scroll</button>
            <button className="btn" onClick={() => updateAutoScroll()}>ToggleAutoScroll</button>
            <button className="btn" onClick={() => {
                Debug();
                setDebugLog(debug_log+"\n"+log);
            }}>Debug</button>
        </div>
    );
}