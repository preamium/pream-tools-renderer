import * as pug from 'pug'
import * as less from 'less'
import * as path from 'path'
import * as fs from 'fs-extra'

export default class PreamRenderer {

    private template: pug.compileTemplate

    private style: string
    private dom: string
    private stuffPath: string
    private stuffFilename: string

    constructor(stuffPath: string, stuffFilename: string) {
        this.stuffPath = stuffPath
        this.stuffFilename = stuffFilename
        this.template = pug.compileFile(path.join(stuffPath, `${stuffFilename}.pug`))
    }

    private renderDom(content: any): Promise<void> {
        this.dom = this.template({ content })
        return Promise.resolve()
    }

    private async renderStyle(content: any): Promise<void> {
        const style = await fs.readFile(path.join(this.stuffPath, `${this.stuffFilename}.less`), 'utf-8')
        this.style = (await less.render(style)).css
        return Promise.resolve()
    }

    async process(content: any): Promise<void> {
        await Promise.all([this.renderDom(content), this.renderStyle(content)])
        return Promise.resolve()
    }

    struct() {
        return {
            style: this.style,
            dom: this.dom,
        }
    }
}
