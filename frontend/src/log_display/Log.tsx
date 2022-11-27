import React, {useEffect, useRef, useState} from "react";
import {GetLatestId, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import {SyntaxHighlight} from "./SyntaxHightLight";
import Prism from "prismjs";
import {AutoScrollAtom} from "./atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {ScrollLog} from "./function/ScrollLog";
import {LogAtom} from "./atom/LogAtom";
import "./css/Log.css";
import {DebugAtom} from "./atom/DebugAtom";

export function Log () {
    const [log] = useRecoilValue(LogAtom);
    const log_ref = useRef(log);
    const auto_scroll = useRecoilValue(AutoScrollAtom);
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const ids = useRef(0);
    const intervalId  = useRef(setInterval( () => checkUpdate(), 20));

    function checkUpdate() {
        NeedsUpdate(ids.current).then((needsUpdate: boolean) => {
            if(!needsUpdate) return;
            setDebugLog(debug_log +"\n"+"called!");
            GetLatestId().then((latestId: number) => {
                ids.current = latestId; //sync to backend logger id
                setDebugLog(debug_log +"\n"+ids.current);
                getLogsBetween(ids.current, latestId).then((newLogs) => {

                    setDebugLog(debug_log +"\nnewlen:"+newLogs.length);
                    log_ref.current = log_ref.current.concat(newLogs);

                }).then(() => createLogContents(log_ref.current));
            });
        })
    }

    function getLogsBetween(startId: number, endId: number): Promise<Awaited<LogMessage>[]> {
        let promises: Promise<LogMessage>[] = [];

        for (let id = startId; id <= endId; ++id){
            promises.push(LogMessage.fromId(id));
        }
        return Promise.all(promises);
    }

    function createLogContents(logs: LogMessage[]) {
        let log_elements: React.DetailedReactHTMLElement<any, HTMLElement>[] = [];
        logs.forEach((log: LogMessage) => log_elements.push(log.toElement()));

        const log_box = document.getElementById('log-container');
        if(log_box === null) return;
        const root = createRoot(log_box);
        root.render(React.createElement('div', {
            children: log_elements
        }));
    }

    useEffect(() => {
        Prism.highlightAll();

        if(auto_scroll){
            ScrollLog()
        }
    }, [log]);
    return  (
        <div id="Log">
            <SyntaxHighlight>
                <div className="log-container" id="log-container"/>
            </SyntaxHighlight>
        </div>
    );
}