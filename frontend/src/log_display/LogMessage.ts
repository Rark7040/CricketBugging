import {GetContent, GetTitle} from "../../wailsjs/go/main/WailsBinds";
import React, {SyntheticEvent} from "react";
import "./css/LogMessage.css";
import {SyntaxHighlight} from "./SyntaxHightLight";
import Prism from "prismjs";

export class LogMessage {
    private readonly id: number;
    private readonly title: string;
    private readonly content: string;
    private readonly prefix: string;

    public constructor(id: number, title: string, content: string) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.prefix = LogMessage.getPrefix();

    }

    public getId(): number {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getContent(): string {
        return this.content;
    }

    private static getPrefix(): string {
        const date: Date = new Date();
        return "[" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]: ";
    }

    public toElement(): React.DetailedReactHTMLElement<{ children: any[]; key: string }, HTMLElement> {
        const id = this.getId();
        const title = React.createElement('div', {
            key: "log" + id,
            id: "log" + id,
            className: "log-title",
            children: [this.prefix + this.getTitle()]
        });

        const content_class = this.getContent() === ""? "log-content-empty": "log-content";
        const content_id = this.getContent() === ""? "log" + id + "-content-empty": "log" + id + "-content";
        const content = React.createElement('div', {
            key: "log" + id + "-content",
            id: content_id,
            className: content_class,
            children: [React.createElement(SyntaxHighlight, {language: "js", children: [this.getContent()]})]
        });

        return React.createElement('div', {
            key: "log" + id + "ls",
            id: "log" + id + "ls",
            className: "logs",
            children: [title, content],
            onClick: (ev: SyntheticEvent) => {
                // @ts-ignore
                const id: string|null = ev.target.id;
                if(id === null) return;
                const logs = document.getElementById(id + "ls"); //Los
                const log_title = document.getElementById(id); //title
                const log_content = document.getElementById(id + "-content"); //log-content
                if(logs === null || log_title === null || log_content === null) return;
                if(log_content.style.display === "none" || log_content.style.display === ""){
                    logs.style.backgroundColor = "#1c1c1c";
                    log_title.style.paddingTop= "5px";
                    log_title.style.paddingBottom = "10px";
                    log_content.style.display = "block";

                }else{
                    logs.style.backgroundColor = "#222";
                    log_title.style.paddingTop= "0px";
                    log_title.style.paddingBottom = "0px";
                    log_content.style.display = "none";
                }
            },
        });
    }

    public static fromId(id: number): Promise<LogMessage> {
        return new Promise((resolve: (value: (PromiseLike<LogMessage> | LogMessage)) => void) => {
            GetTitle(id).then((title: string) => {
                GetContent(id).then((content: string) => {
                    resolve(new LogMessage(id, title, content));
                })
            })
        });
    }
}