import { expect } from 'chai'
import Renderer from '../src/main'
import { IRenderInput, IRenderOutput } from 'pream-types'

describe('main.ts', function () {
    it('should render basic', async () => {
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

    it('should render dom with wrapper', async () => {
        const r: Renderer = new Renderer('.clock-container#N##T#.time content#N##T#.loc header', null, 'wrapper')
        const input: IRenderInput = { content: 'content' }

        await r.process(input)

        const expected: IRenderOutput = {
            dom: '<div class="wrapper"><div class="clock-container"></div><div class="time">content</div><div class="loc">header</div></div>',
            style: undefined,
        }

        const output: IRenderOutput = r.struct()

        expect(output).to.eql(expected)
    })

    it('should render style with wrapper', async () => {
        const r: Renderer = new Renderer(null, '.parent{ #N##T#line-height: 1em;#N##T#font-weight: 600;#N##T#width: 100%;#N##N##T#.child{#N##T##T#line-height: 1em;#N##T##T#font-size: smaller;#N##T##T#font-weight: lighter;#N##T##T#text-align: center;#N##T#}#N#}', 'wrapper')
        const input: IRenderInput = { content: 'content' }

        await r.process(input)

        const expected: IRenderOutput = {
            dom: undefined,
            style: 'div.wrapper .parent{line-height:1em;font-weight:600;width:100%}div.wrapper .parent .child{line-height:1em;font-size:smaller;font-weight:lighter;text-align:center}',
        }

        const output: IRenderOutput = r.struct()

        expect(output).to.eql(expected)
    })
})
