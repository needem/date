import Ajv from 'ajv'

export class Formatter {

	#ajv

	#locale

	#withDate

	#h24
	
	#withTime

	#withSeconds

	#withMilli

	#withTimezone

	#timezone

	#actual

	#literal

	#monthFirst

	constructor(config = {}) {
		this.#ajv = new Ajv()

		this.#locale = config.locale
		this.#withTimezone = config.withTimezone || false
		this.#withDate = config.withDate || true
		this.#h24 = config.h24 || false
		this.#withMilli = config.withMilli || false
		this.#withSeconds = config.withSeconds || this.#withMilli
		this.#withTime = config.withTime || this.#withSeconds || this.#withTimezone
		this.#timezone = config.timezone

		this.#actual = this.#createActual({
			locale: this.#locale,
			withDate: this.#withDate,
			h24: this.#h24,
			withTime: this.#withTime,
			withSeconds: this.#withSeconds,
			withMilli: this.#withMilli,
			withTimezone: this.#withTimezone,
			timezone: this.#timezone
		})

		this.#literal = this.#findLiteral(this.#actual)
		this.#monthFirst = this.#isMonthFirst(this.#actual)
	}

	static create(config) {
		return new Formatter(config)
	}

	format(v, config) {
		let actual = this.#actual
		if(config) {
			const newConfig = Object.assign({}, this.config, config)
						
			return this.#createActual(newConfig).format(v)
		} else {
			return this.#actual.format(v)
		}
	}

	#createActual(config) {
		this.#validate(config)

		// date
		let month, day, year
		if(config.withDate) {
			day = '2-digit'
			month = '2-digit'
			year = 'numeric'
		}

		// time
		let hour, minute, second
		if(config.withTime) {
			hour = '2-digit'
			minute = '2-digit'
		}

		if(config.withSeconds) {
			second = '2-digit'
		}
		
		let fractionalSecondDigits
		if(config.withMilli) {
			fractionalSecondDigits = 3
		}

		return new Intl.DateTimeFormat(config.locale, {
			day,
			month,
			year,
			hour,
			minute,
			second,
			fractionalSecondDigits,
			hour12: !config.h24,
			timeZone: config.timezone || 'utc',
			timeZoneName: config.withTimezone ? 'short' : undefined
		})
	}

	#validate(v, schema = CONFIG) {
		let valid = this.#ajv.validate(schema, v)
		if(!valid) {
			throw this.#ajv.errors[0]
		}
	}

	#findLiteral(formatter) {
		const parts = formatter.formatToParts(new Date())

		return parts.find(({ type }) => type === 'literal').value
	}

	get literal() {
		return this.#literal
	}

	#isMonthFirst(formatter) {
		const parts = formatter.formatToParts(new Date())
		const idx = parts.findIndex(({ type }) => type === 'month')
		return idx === 0
	}

	get monthFirst() {
		return this.#monthFirst
	}

	get config() {
		return {
			locale: this.#locale,
			withDate: this.#withDate,
			h24: this.#h24,
			withTime: this.#withTime,
			withSeconds: this.#withSeconds,
			withMilli: this.#withMilli,
			withTimezone: this.#withTimezone,
			timezone: this.#timezone
		}
	}
}

export const DISPLAY_ENUM = ['short', 'medium', 'full', 'long']

export const CONFIG_PROPS = {
	locale: {
		type: 'string'
	},
	withDate: {
		type: 'boolean'
	},
	h24: {
		type: 'boolean'
	},
	withTime: {
		type: 'boolean'
	},
	withSeconds: {
		type: 'boolean'
	},
	withMilli: {
		type: 'boolean'
	},
	withTimezone: {
		type: 'boolean'
	},
	timezone: {
		type: 'string'
	}
}

const CONFIG = {
	type: 'object',
	properties: CONFIG_PROPS,
	required: ['locale'],
	additionalProperties: false
}

