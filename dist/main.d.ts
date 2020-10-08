import { IRenderInput, IRenderOutput } from 'pream-types';
export default class PreamRenderer {
    private template;
    private style;
    private dom;
    private lessContent;
    constructor(inlineTemplate?: string, inlineStyle?: string);
    private renderDom;
    private renderStyle;
    process(input: IRenderInput): Promise<void>;
    struct(): IRenderOutput;
}
