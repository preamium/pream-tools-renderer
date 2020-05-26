export default class PreamRenderer {
    private template;
    private style;
    private dom;
    private stuffPath;
    private stuffFilename;
    constructor(stuffPath: string, stuffFilename: string);
    private renderDom;
    private renderStyle;
    process(content: any): Promise<void>;
    struct(): {
        style: string;
        dom: string;
    };
}
