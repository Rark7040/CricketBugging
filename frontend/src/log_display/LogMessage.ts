import {GetContent, GetTitle} from "../../wailsjs/go/main/WailsBinds";

export class LogMessage {
    private readonly title: string;
    private readonly content: string;

    private constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }

    public getTitle(): string {
        return this.title;
    }

    public getContent(): string {
        return this.title;
    }

    public static fromId(id: number): Promise<LogMessage> {
        return new Promise(() => {
            GetTitle(id).then((title: string) => {
                GetContent(id).then((content: string) => {
                    return new LogMessage(title, content);
                });
            });
        });
    }
}