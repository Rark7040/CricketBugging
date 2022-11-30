import {GetContent, GetTitle} from "../../wailsjs/go/main/WailsBinds";
import React, {SyntheticEvent} from "react";
import "./css/LogMessage.css";

export class LogMessage {
    private readonly id: number;
    private readonly title: string;
    private readonly content: string;

    private constructor(id: number, title: string, content: string) {
        this.id = id;
        this.title = title;
        this.content = content;
    }

    public getId(): number {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getContent(): string {
        return this.title;
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
            onClick: (ev: SyntheticEvent) => {
                // @ts-ignore
                const id: string|null = ev.target.id;
                if(id === null) return;

                const log_content = document.getElementById(id+"-content");
                if(log_content === null) return;
                if(log_content.style.display === "none" || log_content.style.display === ""){
                    log_content.style.display = 'block';

                }else{
                    log_content.style.display = 'none';
                }
            },
            children: [LogMessage.getPrefix() + this.getTitle()]
        });

        const content = React.createElement('div', {
            key: "log" + id + "-content",
            id: "log" + id + "-content",
            className: "log-content",
            children: [this.getContent()]
        });

        return React.createElement('div', {
            key: "log-list" + id,
            children: [title, content]
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