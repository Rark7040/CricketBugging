import React, {Component, useEffect, useState} from "react";
import {GetLatestId, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import {SyntaxHighlight} from "./SyntaxHightLight";
import Prism from "prismjs";

export class Log extends Component {
    private static ids: number = 0;
    private static interval: number|undefined = undefined;

    private checkUpdate(logs: LogMessage[], setLog: Function) {
        NeedsUpdate(Log.ids).then((needsUpdate: boolean) => {
            if(!needsUpdate) return;
            GetLatestId().then((latestId: number) => {
                Log.getLogsBetween(Log.ids, latestId).then((newLogs) => setLog(logs.concat(newLogs)));
                Log.ids = latestId; //sync to backend logger id
            });
        })
    }

    private static getLogsBetween(startId: number, endId: number): Promise<Awaited<LogMessage>[]> {
        let promises: Promise<LogMessage>[] = [];

        for (let id = startId; id <= endId; ++id){
            promises.push(LogMessage.fromId(id));
        }
        return Promise.all(promises);
    }

    private static createLogContents(logs: LogMessage[]) {
        let log_elements: React.DetailedReactHTMLElement<any, HTMLElement>[] = [];
        logs.forEach((log: LogMessage) => log_elements.push(log.toElement()));

        const log_box = document.getElementById('log-container');
        if(log_box === null) return;
        const root = createRoot(log_box);
        root.render(React.createElement('div', {
            children: log_elements
        }));
    }

    private static scroll() {
        const log_container = document.getElementById("log-container");

        if(log_container !== null){
            log_container.scrollTop = log_container.scrollHeight;
        }
    };

    public render(){
        const [log, setLog] = useState([]);
        Log.interval ??= setInterval( () => this.checkUpdate(log, setLog), 20);
        Log.createLogContents(log);

        useEffect(() => {
            Prism.highlightAll();
            scroll()
        }, [log]);

        return  (
            <div id="Log">
                <SyntaxHighlight>
                    <div className="log-container" id="log-container"/>
                </SyntaxHighlight>
            </div>
        );
    }
}