export class UndefinedPageError extends Error {
    public constructor(page: string) {
        super("undefined page," + page);
    }
}