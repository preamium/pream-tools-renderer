import { expect } from 'chai'
import Renderer from '../src/main'
import { IRenderInput, IRenderOutput } from 'pream-types'

describe('main.ts', function () {
    it('should render using inline stuff', async () => {
        const r: Renderer = new Renderer('.content content', '.myclass{ color : white }')
        const input: IRenderInput = {
            content: 'content',
            header: 'header',
            iconClass: 'iconClass',
        } as IRenderInput

        await r.process(input)

        const expected: IRenderOutput = {
            style: '.myclass{color:white}',
            dom: '<div class="content">content</div>',
        }

        const output: IRenderOutput = r.struct()

        expect(output).to.eql(expected)
    })
})
