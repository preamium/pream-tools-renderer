import * as pug from 'pug'
import * as less from 'less'
import * as path from 'path'
import * as fs from 'fs-extra'
import { IRenderInput, IRenderOutput } from 'pream-types'

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
        try {
            this.dom = this.template({ content: input.content })
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    private async renderStyle(input: IRenderInput): Promise<void> {
        try {
            const style = await fs.readFile(path.join(this.stuffPath, `${this.stuffFilename}.less`), 'utf-8')
            this.style = (await less.render(style)).css
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    private renderHeader(input: IRenderInput): void {
        this.header = input.header
    }

    async process(input: IRenderInput): Promise<void> {
        return Promise.race([this.renderDom(input), this.renderStyle(input), this.renderHeader(input)])
    }

    struct(): IRenderOutput {
        return {
            style: this.style,
            dom: this.dom,
            header: this.header,
        }
    }
}
