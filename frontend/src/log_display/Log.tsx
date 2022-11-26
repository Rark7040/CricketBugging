import React, {useEffect} from "react";
import {GetLatestId, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import {SyntaxHighlight} from "./SyntaxHightLight";
import Prism from "prismjs";
import {AutoScrollAtom} from "./atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {ScrollLog} from "./function/ScrollLog";
import {LogAtom} from "./atom/LogAtom";

export function Log () {
    const [log, setLog] = useRecoilState(LogAtom);
    const auto_scroll = useRecoilValue(AutoScrollAtom);

    let ids: number = 0;
    let interval: number|undefined = undefined;

    function checkUpdate(logs: LogMessage[], setLog: Function) {
        NeedsUpdate(ids).then((needsUpdate: boolean) => {
            if(!needsUpdate) return;
            GetLatestId().then((latestId: number) => {
                getLogsBetween(ids, latestId).then((newLogs) => setLog(logs.concat(newLogs)));
                ids = latestId; //sync to backend logger id
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

    interval ??= setInterval( () => checkUpdate(log, setLog), 10000000000);
    createLogContents(log);

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