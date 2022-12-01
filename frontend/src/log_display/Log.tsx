import React, {useEffect, useRef, useState} from "react";
import {GetLatestId, KillGopherTunnel, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import Prism from "prismjs";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {Scroll} from "./function/Scroll";
import "./css/Log.css";
import {DebugAtom} from "./recoil/atom/DebugAtom";
import {SyntaxHighlight} from "./SyntaxHightLight";

export function Log () {
    const default_log: LogMessage[] = [];
    const log= useRef(default_log);
    const auto_scroll = useRecoilValue(AutoScrollAtom);
    const ids = useRef(0);
    const intervalId  = useRef(setInterval( () => checkUpdate(), 500));

    async function checkUpdate() {
        NeedsUpdate(ids.current).then((needsUpdate: boolean) => {
            if(!needsUpdate) return;
            GetLatestId().then((latestId: number) => {
                getLogsBetween(ids.current, latestId); //fix list index
            });
        })
    }

    function getLogsBetween(startId: number, endId: number){
        let promises: Promise<LogMessage>[] = [];
        let cnt = 0;

        for (let id = startId; id < endId; ++id){
            promises.push(LogMessage.fromId(id));
            ++cnt;
        }
        ids.current = endId; //sync to backend logger id

        Promise.all(promises).then((newLogs) => {
            log.current = log.current.concat(newLogs);
            createLogContents(log.current);
        });
    }

    function createLogContents(logs: LogMessage[]) {
        let log_elements: React.DetailedReactHTMLElement<any, HTMLElement>[] = [];
        logs.forEach((log) => log_elements.push(log.toElement()));

        const log_container = document.getElementById('log-container');

        if(log_container === null) return;
        const root = createRoot(log_container);
        root.render(React.createElement('div', {
            children: log_elements
        }));
    }

    useEffect(() => {
        if(auto_scroll){
            Scroll("log-container");
        }
    }, []);

    return  (
        <div id="Log">
            <div className="log-container" id="log-container"/>
            <button className="btn" onClick={() => {
                log.current.push(new LogMessage(100000, "testlog", "ahoaho"));
                createLogContents(log.current)
            }}>AddLog</button>
        </div>
    );
}