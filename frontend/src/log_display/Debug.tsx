import "./css/Debug.css";
import {useRecoilState} from "recoil";
import {DebugAtom} from "./recoil/atom/DebugAtom";
import React, {useEffect} from "react";
import {Scroll} from "./function/Scroll";

export function Debug() {
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);

    useEffect(() => {
        Scroll("debug-log-container");
    }, [debug_log]);
    return (
        <div id="Debug">
            <div className="debug-log-container" id="debug-log-container">{debug_log}</div>
        </div>
    );
}