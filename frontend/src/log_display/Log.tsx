import React, {useEffect, useRef, useState} from "react";
import {GetContent, GetLatestId, GetTitle, NeedsUpdate, RunGopherTunnel} from "../../wailsjs/go/main/WailsBinds";
import {LogMessage} from "./LogMessage";
import {createRoot} from "react-dom/client";
import {SyntaxHighlight} from "./SyntaxHightLight";
import Prism from "prismjs";
import {AutoScrollAtom} from "./recoil/atom/AutoScrollAtom";
import {useRecoilState, useRecoilValue} from "recoil";
import {Scroll} from "./function/Scroll";
import {LogAtom} from "./recoil/atom/LogAtom";
import "./css/Log.css";
import {DebugAtom} from "./recoil/atom/DebugAtom";

export function Log () {
    const [log] = useRecoilValue(LogAtom);
    const log_ref = useRef(log);
    const auto_scroll = useRecoilValue(AutoScrollAtom);
    const [debug_log, setDebugLog] = useRecoilState(DebugAtom);
    const ids = useRef(0);
    //const intervalId  = useRef(setInterval( () => checkUpdate(), 20));

    function checkUpdate() {
        NeedsUpdate(ids.current).then((needsUpdate: boolean) => {

            if(!needsUpdate){
                setDebugLog(debug_log +"\n"+"更新ねーわ。現在:"+ ids.current);
            }

            if(!needsUpdate) return;
            GetLatestId().then((latestId: number) => {
                getLogsBetween(ids.current, latestId);
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
            log_ref.current = log_ref.current.concat(newLogs); //なぜか呼ばれない
            createLogContents(log_ref.current); //多分呼ばれてない
            setDebugLog(debug_log +"\n"+"更新したで"); //なぜか呼ばれない
        });


        LogMessage.fromId(endId).then(
            (msg) => {
                setDebugLog(debug_log + "\n" + "取得完了 " + cnt + "件" + "\n" + "開始: " + startId + "  確定: " + endId + " title: " + msg.getTitle() + " content: " + msg.getContent());
            }
        );
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
            Scroll("log-container");
        }
    }, [log]);
    return  (
        <div id="Log">
            <SyntaxHighlight>
                <div className="log-container" id="log-container"/>
            </SyntaxHighlight>
            <button className="btn" onClick={() => checkUpdate()}>Update</button>
        </div>
    );
}