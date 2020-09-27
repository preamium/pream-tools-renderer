import * as path from 'path'
import { expect, assert } from 'chai'
import Renderer from '../src/main'
import { IRenderInput, IRenderOutput } from 'pream-types'

describe('main.ts', function () {
    it('should render using file stuff', async () => {
        const r: Renderer = new Renderer(path.join(__dirname, 'stuff'), 'stuff')
        const input: IRenderInput = {
            content: 'content',
            header: 'header',
            iconClass: 'iconClass',
        } as IRenderInput

        await r.process(input)

        const expected: IRenderOutput = {
            style: '.myclass{font-weight:bold}.myclass .nested{color:red}',
            dom: '<div class="content">content</div>',
            header: 'header',
        }

        const output: IRenderOutput = r.struct()

        expect(output).to.eql(expected)
    })

    it('should render using inline stuff', async () => {
        const r: Renderer = new Renderer(null, null, '.content content', '.myclass{ color : white }')
        const input: IRenderInput = {
            content: 'content',
            header: 'header',
            iconClass: 'iconClass',
        } as IRenderInput

        await r.process(input)

        const expected: IRenderOutput = {
            style: '.myclass{color:white}',
            dom: '<div class="content">content</div>',
            header: 'header',
        }

        const output: IRenderOutput = r.struct()

        expect(output).to.eql(expected)
    })

    it('should not construct', () => {
        // tslint:disable-next-line: no-unused-expression
        let fcn = function () { new Renderer('not', 'exists') }
        expect(fcn).to.throw(Error, 'one or many stuff file not found')
    })
})
