import {ScrollLog} from "./function/ScrollLog";
import {KillGopherTunnel, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {useRecoilState} from "recoil";
import {AutoScrollAtom} from "./atom/AutoScrollAtom";

export function ButtonControls() {
    const [auto_scroll, setAutoScroll] = useRecoilState(AutoScrollAtom);
    const updateAutoScroll = () => setAutoScroll(!auto_scroll);

    return (
        <div id="ButtonControls">
            <button className="btn" onClick={() => RunGopherTunnel}>Start</button>
            <button className="btn" onClick={() => KillGopherTunnel}>Kill</button>
            <button className="btn" onClick={() => ScrollLog}>Scroll</button>
            <button className="btn" onClick={() => updateAutoScroll}>ToggleAutoScroll</button>
        </div>
    );
}