import * as pug from 'pug'
import * as less from 'less'
import { IRenderInput, IRenderOutput } from 'pream-types'

export default class PreamRenderer {

    private template: pug.compileTemplate

    private style: string
    private dom: string
    private lessContent: string

    constructor(inlineTemplate?: string, inlineStyle?: string) {
        this.template = pug.compile(inlineTemplate)
        this.lessContent = inlineStyle
    }

    private renderDom(input: IRenderInput): Promise<void> {
        try {
            this.dom = this.template({ content: input.content })
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    private async renderStyle(): Promise<void> {
        try {
            const style: Less.RenderOutput = await less.render(this.lessContent, { compress: true })
            this.style = style.css
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    async process(input: IRenderInput): Promise<void> {
        return Promise.race([this.renderDom(input), this.renderStyle()])
    }

    struct(): IRenderOutput {
        return {
            style: this.style,
            dom: this.dom,
        }
    }
}
