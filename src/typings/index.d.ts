declare class PreamRenderer {
    constructor(stuffPath: string, stuffFilename: string);
    struct(): any;
    process: Promise<void>;
}