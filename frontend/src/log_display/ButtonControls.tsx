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

    function updateAutoScroll(){
        const toggle_scroll_btn = document.getElementById("auto-scroll-btn");
        if(toggle_scroll_btn === null) return;
        if(auto_scroll){
            toggle_scroll_btn.style.backgroundColor = "#888888";

        }else{
            toggle_scroll_btn.style.backgroundColor = "#9cd267";
        }
        setAutoScroll(!auto_scroll);
    }

    return (
        <div id="ButtonControls">
            <div className="button-controls">
                <ul className="buttons-list">
                    <li><button className="control-btn-start" onClick={() => RunGopherTunnel(localAddr, remoteAddr)}>Start</button></li>
                    <li><button className="control-btn-kill" onClick={() => KillGopherTunnel()}>Kill</button></li>
                    <li><button className="control-btn-scroll" onClick={() => Scroll("log-container")}>Scroll</button></li>
                    <li><button className="control-btn-toggle-scroll" id="auto-scroll-btn" onClick={() => updateAutoScroll()}>ToggleAutoScroll</button></li>
                </ul>
            </div>
        </div>
    );
}