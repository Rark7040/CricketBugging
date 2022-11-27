import "./css/Debug.css";
import {useRecoilState} from "recoil";
import {DebugAtom} from "./atom/DebugAtom";
import {useState} from "react";

export function Debug() {
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const [is_render, setRender] = useState(false);
    let [cnt, setCnt] = useState(0);

    if(!is_render){
        setDebugLog(debug_log + "\n\n" + "aho"+cnt); // ここで一回更新
        setRender(true); //また更新

        ++cnt;
        setCnt(cnt);
    }

    return (
        <div id="Debug">
            <div className="debug-log-container">{debug_log}</div>
        </div>
    );
}