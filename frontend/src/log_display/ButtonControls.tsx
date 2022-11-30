import {Scroll} from "./function/Scroll";
import {AddLog, Debug, KillGopherTunnel, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {useRecoilState, useRecoilValue} from "recoil";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {LocalAddressAtom} from "./recoil/atom/LocalAddressAtom";
import {RemoteAddressAtom} from "./recoil/atom/RemoteAddressAtom";
import {DebugAtom} from "./recoil/atom/DebugAtom";
import {LogAtom} from "./recoil/atom/LogAtom";

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
            <button className="btn" onClick={() => Scroll("log-container")}>Scroll</button>
            <button className="btn" onClick={() => updateAutoScroll()}>ToggleAutoScroll</button>
            <button className="btn" onClick={() => {
                Debug();
                setDebugLog(debug_log+"\n"+log.length+"件のts側在庫");
            }}>Debug</button>
            <button className="btn" onClick={() => AddLog()}>AddLog</button>
        </div>
    );
}