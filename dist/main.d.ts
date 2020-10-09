import { IRenderInput, IRenderOutput } from 'pream-types';
export default class PreamRenderer {
    private inlineTemplate?;
    private inlineStyle?;
    private wrapperClass?;
    private template;
    private style;
    private dom;
    constructor(inlineTemplate?: string, inlineStyle?: string, wrapperClass?: string);
    private renderDom;
    private renderStyle;
    process(input: IRenderInput): Promise<void>;
    struct(): IRenderOutput;
}
