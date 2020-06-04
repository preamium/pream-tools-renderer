export interface IRenderInput {
    content: string;
    header: string;
}
export interface IRenderOutput {
    dom: string;
    style: string;
    header?: string;
}
