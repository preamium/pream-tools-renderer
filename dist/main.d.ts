import { IRenderInput, IRenderOutput } from 'pream-types';
export default class PreamRenderer {
    private template;
    private style;
    private header;
    private dom;
    private stuffPath;
    private stuffFilename;
    constructor(stuffPath: string, stuffFilename: string);
    private renderDom;
    private renderStyle;
    private renderHeader;
    process(input: IRenderInput): Promise<void>;
    struct(): IRenderOutput;
}
