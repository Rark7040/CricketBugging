import React, { useEffect, useRef, useState} from "react";
import {GetLatestId, IsRunningGopherTunnel, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import Prism from "prismjs";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {Scroll} from "./function/Scroll";
import "./css/Log.css";
import {RunningAtom} from "./recoil/atom/RunnigAtom";

export function Log () {
    const auto_scroll = useRecoilValue(AutoScrollAtom);
    const default_displayed_log: React.DetailedReactHTMLElement<any, HTMLElement>[] = [];
    const [displayed_log, setDisplayedLog] = useState(default_displayed_log);
    const [is_running, setRunning] = useRecoilState(RunningAtom);
    const default_log: LogMessage[] = [];
    const log= useRef(default_log);
    const ids = useRef(0);
    const intervalId  = useRef(setInterval( () => checkUpdate(), 100)); //exec once

    async function checkUpdate() {
        NeedsUpdate(ids.current).then((needsUpdate: boolean) => {
            if(!needsUpdate) return;
            IsRunningGopherTunnel().then(setRunning);
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
        setDisplayedLog(log_elements);
    }

    useEffect(() => {
        Prism.highlightAll();

        if(auto_scroll){
            Scroll("log-container");
        }
    }, [displayed_log]);

    return  (
        <div id="Log">
            <div className="log-container" id="log-container"> {displayed_log} </div>
        </div>
    );
}