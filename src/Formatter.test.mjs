import { describe } from 'node:test'
import { it } from 'node:test'
import { before } from 'node:test'
import assert from 'node:assert/strict'
import { Formatter } from './Formatter.mjs'

const now = new Date('2024-05-21T20:49:14.423Z')

describe('Formatter', () => {
    
    let f

    before(async () => {
        f = Formatter.create({ locale: 'en-US' })
    })

    it('should define literal in ru', () => {
        const ru = Formatter.create({ locale: 'ru' })

        assert.equal(ru.literal, '.')
    })

    it('should define literal in us', () => {
        assert.equal(f.literal, '/')
    })

    it('should format value', () => {
        assert.equal(f.format(now), '05/21/2024')
    })

    it('should format with time', () => {
        const c = Formatter.create({
            locale: 'en-US',
            withTime: true
        })

        assert.equal(c.format(now), '05/21/2024, 08:49 PM')
    })

    it('should format with time (24h)', () => {
        const c = Formatter.create({
            locale: 'en-US',
            h24: true,
            withTime: true
        })

        assert.equal(c.format(now), '05/21/2024, 20:49')
    })

    it('should format with seconds', () => {
        const c = Formatter.create({
            locale: 'en-US',
            h24: true,
            withSeconds: true
        })

        assert.equal(c.format(now), '05/21/2024, 20:49:14')
    })

    it('should format with milliseconds', () => {
        const c = Formatter.create({
            locale: 'en-US',
            h24: true,
            withMilli: true
        })

        assert.equal(c.format(now), '05/21/2024, 20:49:14.423')
    })

    it('should format with timezone', () => {
        const c = Formatter.create({
            locale: 'en-US',
            h24: true,
            withTimezone: true
        })

        assert.equal(c.format(now), '05/21/2024, 20:49 UTC')
    })

    it('should format with timezone in Europe/Athens', () => {
        const c = Formatter.create({
            locale: 'el',
            withTimezone: true
        })

        assert.equal(c.format(now), '21/05/2024, 08:49 μ.μ. UTC')
    })

    // it('should format in ru (with time)', () => {
    //     const ru = Formatter.create({ 
    //         locale: 'ru',
    //         withTime: true 
    //     })

    //     assert.equal(ru.format(now), '21.05.2024, 16:49')
    // })

    // it('should format to full string', () => {
    //     const el = Formatter.create({ 
    //         locale: 'en-CA',
    //         withTime: true,
    //         display: 'full' 
    //     })
    //     assert.equal(el.format(now), '')
    // })

    it('month goes first', () => {
        assert.ok(f.monthFirst)
    })

    it('should set month first to false', () => {
        const el = Formatter.create({ locale: 'el-GR' })
        assert.equal(el.monthFirst, false)
    })

})