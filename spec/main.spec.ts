import * as path from 'path'
import { expect, assert } from 'chai'
import Renderer from '../src/main'
import { IRenderInput, IRenderOutput } from 'pream-types'

describe('main.ts', function () {
    it('should render', async function () {
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

    it('should not construct', function () {
        // tslint:disable-next-line: no-unused-expression
        let fcn = function () { new Renderer('not', 'exists') };
        expect(fcn).to.throw(Error, 'path/file not found');
    })
})
