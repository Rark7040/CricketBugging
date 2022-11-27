import "./css/Debug.css";
import {useRecoilState} from "recoil";
import {DebugAtom} from "./atom/DebugAtom";
import {useEffect, useRef} from "react";

export function Debug() {
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const cnt = useRef(0);

    useEffect(() => {
        if(cnt.current < 1){
            setDebugLog((prevLog: string) => prevLog + "\n\n" + "aho"+cnt.current);
            cnt.current++;
        }
    });
    return (
        <div id="Debug">
            <pre className="debug-log-container" id="debug-log-container">{debug_log}</pre>
        </div>
    );
}