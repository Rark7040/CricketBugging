import React, {Component, useState} from "react";
import {GetLatestId, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";

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

    private static getLogsBetween(startId: number, endId: number) {
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

    public render(){
        const [log, setLog] = useState([]);
        Log.interval ??= setInterval( () => this.checkUpdate(log, setLog), 20);
        Log.createLogContents(log);

        return  (
            <div id="Log">
                <div className="log-container" id="log-container"/>
            </div>
        );
    }
}
