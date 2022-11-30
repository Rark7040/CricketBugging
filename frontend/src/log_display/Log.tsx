import React, {useEffect, useRef} from "react";
import {GetLatestId, NeedsUpdate} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import Prism from "prismjs";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {Scroll} from "./function/Scroll";
import "./css/Log.css";
import {DebugAtom} from "./recoil/atom/DebugAtom";

export function Log () {
    const default_log: LogMessage[] = [];
    const log= useRef(default_log);
    const auto_scroll = useRecoilValue(AutoScrollAtom);
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const debug_ref = useRef(debug_log);
    const ids = useRef(0);
    //const intervalId  = useRef(setInterval( () => checkUpdate(), 300));

    async function checkUpdate() {
        NeedsUpdate(ids.current).then((needsUpdate: boolean) => {

            if(!needsUpdate){
                setDebugLog(debug_log +"\n"+"更新ねーわ。現在:"+ ids.current);
            }

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

            debug_ref.current = debug_ref.current + "\n" + "取得中";
        }
        ids.current = endId; //sync to backend logger id

        Promise.all(promises).then((newLogs) => {
            log.current = log.current.concat(newLogs); //なぜか呼ばれない
            createLogContents(log.current); //多分呼ばれてない
        });

        //debug
        LogMessage.fromId(endId-1).then(
            (msg) => {
                const id = endId-1;
                setDebugLog(debug_log + "\n" + "取得完了 " + cnt + "件" + "\n" + "開始: " + startId + "  確定: " + id + " title: " + msg.getTitle() + " content: " + msg.getContent());
            }
        );
    }

    function createLogContents(logs: LogMessage[]) {
        let log_elements: React.DetailedReactHTMLElement<any, HTMLElement>[] = [];
        logs.forEach((log: LogMessage) => log_elements.push(log.toElement()));
        const log_container = document.getElementById('log-container');

        if(log_container === null) return;
        const root = createRoot(log_container);
        root.render(React.createElement('div', {
            children: log_elements
        }));
    }

    useEffect(() => {
        Prism.highlightAll();

        if(auto_scroll){
            Scroll("log-container");
        }
    }, []);
    return  (
        <div id="Log">
            <div className="log-container" id="log-container"/>
            <button className="btn" onClick={() => checkUpdate()}>Update</button>
        </div>
    );
}