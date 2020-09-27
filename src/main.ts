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
    private lessContent: string

    constructor(stuffPath: string, stuffFilename: string, inlineTemplate?: string, inlineStyle?: string) {
        if (!inlineTemplate) {
            const fullPath: string = path.join(stuffPath, stuffFilename)
            if (fs.existsSync(`${fullPath}.pug`)) {
                this.template = pug.compileFile(`${fullPath}.pug`)
            } else {
                throw new Error('one or many stuff file not found')
            }
        } else {
            this.template = pug.compile(inlineTemplate)
        }

        if (!inlineTemplate) {
            const fullPath: string = path.join(stuffPath, stuffFilename)
            if (fs.existsSync(`${fullPath}.less`)) {
                this.lessContent = fs.readFileSync(`${fullPath}.less`, 'utf-8')
            } else {
                throw new Error('one or many stuff file not found')
            }
        } else {
            this.lessContent = inlineStyle
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
            const style: Less.RenderOutput = await less.render(this.lessContent, { compress: true })
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
