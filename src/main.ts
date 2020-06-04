import * as pug from 'pug'
import * as less from 'less'
import * as path from 'path'
import * as fs from 'fs-extra'
import { IRenderInput, IRenderOutput } from './interfaces/io'

export default class PreamRenderer {

    private template: pug.compileTemplate

    private style: string
    private header: string
    private dom: string
    private stuffPath: string
    private stuffFilename: string

    constructor(stuffPath: string, stuffFilename: string) {
        this.stuffPath = stuffPath
        this.stuffFilename = stuffFilename
        this.template = pug.compileFile(path.join(stuffPath, `${stuffFilename}.pug`))
    }

    private renderDom(input: IRenderInput): Promise<void> {
        this.dom = this.template({ content: input.content })
        return Promise.resolve()
    }

    private async renderStyle(input: IRenderInput): Promise<void> {
        const style = await fs.readFile(path.join(this.stuffPath, `${this.stuffFilename}.less`), 'utf-8')
        this.style = (await less.render(style)).css
        return Promise.resolve()
    }

    private renderHeader(input: IRenderInput): Promise<void> {
        this.header = input.header
        return Promise.resolve()
    }

    async process(input: IRenderInput): Promise<void> {
        await Promise.all([this.renderDom(input), this.renderStyle(input), this.renderHeader(input)])
        return Promise.resolve()
    }

    struct(): IRenderOutput {
        return {
            style: this.style,
            dom: this.dom,
            header: this.header,
        }
    }
}
