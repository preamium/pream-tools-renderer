import * as pug from 'pug'
import * as less from 'less'
import PreamOneLiner, * as PreamOneLinerConstant from 'pream-oneliner'
import { IRenderInput, IRenderOutput } from 'pream-types'

export default class PreamRenderer {

    private style: string
    private dom: string

    constructor(private inlineTemplate?: string, private inlineStyle?: string, private wrapperClass?: string) {

        if (this.wrapperClass) {
            const replacer: string = `${PreamOneLinerConstant.NEWLINE}${PreamOneLinerConstant.TAB}`

            if (this.inlineTemplate) {
                this.inlineTemplate = `.${this.wrapperClass}${PreamOneLinerConstant.NEWLINE}${this.inlineTemplate}`
                this.inlineTemplate = `${this.inlineTemplate.replace(new RegExp(PreamOneLinerConstant.NEWLINE, 'gi'), replacer)}`
            }

            if (this.inlineStyle) {
                this.inlineStyle = `div.${this.wrapperClass}{${this.inlineStyle}}`
                this.inlineStyle = `${this.inlineStyle.replace(new RegExp(PreamOneLinerConstant.NEWLINE, 'gi'), replacer)}`
            }
        }
    }

    private async renderDom(input: IRenderInput): Promise<void> {
        if (!this.inlineTemplate) {
            return Promise.resolve()
        }

        try {
            const domUnprocessor: string = await new PreamOneLiner(
                this.inlineTemplate,
                PreamOneLinerConstant.OneLinerType.PUG,
                PreamOneLinerConstant.OneLinerDirection.UNPROCESS,
            ).process()

            this.dom = pug.render(domUnprocessor, { content: input.content })
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    private async renderStyle(): Promise<void> {
        if (!this.inlineStyle) {
            return Promise.resolve()
        }

        try {
            const styleUnprocessor: string = await new PreamOneLiner(
                this.inlineStyle,
                PreamOneLinerConstant.OneLinerType.LESS,
                PreamOneLinerConstant.OneLinerDirection.UNPROCESS,
            ).process()

            const lessRenderer: Less.RenderOutput = await less.render(styleUnprocessor, { compress: true })
            this.style = lessRenderer.css
            return Promise.resolve()
        } catch (e) {
            return Promise.reject(new Error(e))
        }
    }

    async process(input: IRenderInput = { content: null }): Promise<void> {
        return Promise.all([this.renderDom(input), this.renderStyle()])
            .then(() => {
                return Promise.resolve()
            })
            .catch((e: Error) => {
                return Promise.reject(e)
            })
    }

    struct(): IRenderOutput {
        return {
            style: this.style,
            dom: this.dom,
        }
    }
}
