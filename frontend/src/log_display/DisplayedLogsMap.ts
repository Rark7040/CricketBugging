export class DisplayedLogsMap {
    //TODO gc
    private readonly displayed: number[] = [];

    public setDisplay(id: number){
        this.displayed.push(id);
    }

    public isDisplayed(id: number): boolean{
        return id in this.displayed;
    }

    public undisplayed(id: number){
        this.displayed.splice(id);
    }
}