import * as pug from 'pug'
import * as less from 'less'
import * as path from 'path'
import * as fs from 'fs'
import { IRenderInput, IRenderOutput } from 'pream-types'

export default class PreamRenderer {

    private template: pug.compileTemplate

    private style: string
    private header: string
    private dom: string
    private stuffPath: string
    private stuffFilename: string

    constructor(stuffPath: string, stuffFilename: string) {
        const fullPath: string = path.join(stuffPath, stuffFilename)

        if (fs.existsSync(`${fullPath}.pug`)) {
            this.stuffPath = stuffPath
            this.stuffFilename = stuffFilename
            this.template = pug.compileFile(`${fullPath}.pug`)
        } else {
            throw new Error(`path/file not found`)
        }
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
            const lessFile: string = fs.readFileSync(path.join(this.stuffPath, `${this.stuffFilename}.less`), 'utf-8')
            const style: Less.RenderOutput = await less.render(lessFile, { compress: true })
            this.style = style.css
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
