import { describe } from 'node:test'
import { it } from 'node:test'
import { before } from 'node:test'
import assert from 'node:assert/strict'
import { DateTime } from './DateTime.mjs'
import { Formatter } from './Formatter.mjs'

const now = new Date('2024-05-21T20:49:14.423Z')

describe('DateTime', () => {
    
    let d

    before(async () => {
        d = new DateTime()
    })

    it('should format with default', () => {
        d.add()

        assert.equal(d.format(now), '05/21/2024')
    })

    it('should add ne', () => {
        d.add({ locale: 'ne' })

        assert.equal(d.format(now), '२०२४-०५-२१')
    })

    it('should initialize', () => {
        d.init(CONFIG)

        assert.equal(d.format(now), '٢١‏/٠٥‏/٢٠٢٤')
        d.use('belgium-full')
        assert.equal(d.format(now), '21.05.2024, 10:49:14,423 PM MESZ')
    })

    it('should flash', () => {
        d.init(CONFIG)

        assert.equal(d.flash('mk-withTime').format(now), '21.05.2024, во 10:49 попл. CEST')
        assert.equal(d.format(now), '٢١‏/٠٥‏/٢٠٢٤')
    })

    it('should override withTimezone', () => {
        d.init(CONFIG)

        assert.equal(d.flash('belgium-full').format(now, {
            withTimezone: false
        }), '21.05.2024, 10:49:14,423 PM')
    })

    it('should override withDate', () => {
        d.init(CONFIG)

        assert.equal(d.flash('belgium-full').format(now, {
            withDate: false
        }), '10:49:14,423 PM MESZ')
    })

    it('should get current', () => {
        d.init(CONFIG)
        d.use('belgium-full')
        assert.ok(d.current() instanceof Formatter)
        assert.equal(''+d.current(), 'de-BE')
    })

    it('should override withMilli', () => {
        d.init(CONFIG)

        assert.equal(d.flash('belgium-full').format(now, {
            withMilli: false
        }), '21.05.2024, 10:49:14 PM MESZ')
    })
})

const CONFIG = {
    default: 'iraq',
    configs: [{ 
        name: 'iraq',
        locale: 'ar-IQ' 
    }, {
        name: 'belgium-full',
        locale: 'de-BE',
        withMilli: true,
        withTimezone: true,
        timezone: 'Europe/Brussels'
    }, {
        name: 'mk-withTime',
        locale: 'mk-MK',
        withTimezone: true,
        timezone: 'Europe/Skopje'
    }]
}