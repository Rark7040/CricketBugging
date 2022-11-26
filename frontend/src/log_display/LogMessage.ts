import {GetContent, GetTitle} from "../../wailsjs/go/main/WailsBinds";
import React from "react";

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

    public toElement(): React.DetailedReactHTMLElement<{ children: any[]; key: string }, HTMLElement> {
        const id = this.getId();

        //TODO added onClick func
        const title = React.createElement('div', {
            key: "log" + id,
            id: "log" + id,
            className: "log-title",
            children: [this.getTitle()]
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
        return new Promise(() => {
            GetTitle(id).then((title: string) => {
                GetContent(id).then((content: string) => {
                    return new LogMessage(id, title, content);
                });
            });
        });
    }
}