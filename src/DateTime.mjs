import Ajv from 'ajv'
import { Formatter } from './Formatter.mjs'
import { DISPLAY_ENUM } from './Formatter.mjs'
import { CONFIG_PROPS } from './Formatter.mjs'

export class DateTime {

	#formatters = {}

	#activeFormatter

	#flash

	#ajv
	
	constructor() {
		this.#ajv = new Ajv()

		this.init = this.init.bind(this)
	}

	format(value, config) {
		if(Object.keys(this.#formatters).length === 0) {
			throw new Error('no formatters found')
		}

		let name = this.#activeFormatter
		
		if(this.#flash) {
			name = this.#flash

			this.#flash = undefined
		}
		
		if(config) {
			if(config.name) {
				name = config.name
			}

			delete config.name
		}

		const formatter = this.#formatters[name]

		if(!formatter) {
			throw new Error('invalid formatter')
		}

		return formatter.format(value, config)
	}

	formatToParts(value, config) {
		if(Object.keys(this.#formatters).length === 0) {
			throw new Error('no formatters found')
		}

		let name = this.#activeFormatter
		
		if(this.#flash) {
			name = this.#flash

			this.#flash = undefined
		}
		
		if(config) {
			if(config.name) {
				name = config.name
			}

			delete config.name
		}

		const formatter = this.#formatters[name]

		if(!formatter) {
			throw new Error('invalid formatter')
		}

		return formatter.formatToParts(value, config)
	}

	/**
	 * Add a new currency.
	 * 
	 * @param {object}  config
	 * @param [string]  config.name  A name to use as an alias (default: whatever locale is)
	 * @param {string}  locale
	 * @param [boolean] withDate     (default: true)
	 * @param [boolean] h24      	 (default: false)
	 * @param [boolean] withTime 	 (default: false)
	 * @param [boolean] withSeconds  (default: false)
	 * @param [boolean] withMilli    (default: false)
	 * @param [boolean] withTimezone (default: false)
	 * @param [string]  timezone
	 */
 	add(config = { locale: 'en' }) {
		const name = config.name || config.locale

		if(this.#formatters[name]) {
			return this.#formatters[name]
		}

		delete config.name

		const formatter = Formatter.create(config)

		this.#formatters[name] = formatter

		this.#activeFormatter = name

		return this
	}

	use(name) {
		if(!this.#formatters[name]) {
			throw new Error('invalid formatter')
		}

		this.#activeFormatter = name

		return this
	}

	current() {
		if(Object.keys(this.#formatters).length === 0) {
			throw new Error('no formatters found')
		}

		const formatter = this.#formatters[this.#activeFormatter]

		if(!formatter) {
			throw new Error('invalid formatter')
		}

		return formatter
	}

	flash(name) {
		if(!this.#formatters[name]) {
			throw new Error('invalid formatter')
		}

		this.#flash = name

		return this
	}

	/**
	 * Initialize currency instance
	 * 
	 * @param {object}   config
	 * @param [string]   config.default 			   (default: last language in the list)
	 * @param {object[]} config.configs
	 * @param [string]   config.configs[].name
	 * @param {string}   config.configs[].locale
	 * @param [boolean]  config.configs[].withDate     (default: true)
	 * @param [boolean]  config.configs[].h24      	   (default: false)
	 * @param [boolean]  config.configs[].withTime 	   (default: false)
	 * @param [boolean]  config.configs[].withSeconds  (default: false)
	 * @param [boolean]  config.configs[].withMilli    (default: false)
	 * @param [boolean]  config.configs[].withTimezone (default: false)
	 * @param [string]   config.configs[].timezone
	 */
	init(config) {
		const valid = this.#ajv.validate(INIT_CONFIG, config)
		if(!valid) {
			throw this.#ajv.errors[0]
		}

		for(const conf of config.configs) {
			this.add(conf)
		}

		if(config.default) {
			this.use(config.default)
		} else {
			const lastConfig = config.configs[config.configs.length - 1]
			this.use(lastConfig.name || lastConfig.locale)
		}
	}

	clear() {
		this.#formatters = {}
		this.#activeFormatter = undefined
	}
}

const INIT_CONFIG = {
	type: 'object',
	properties: {
		default: {
			type: 'string'
		},
		configs: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string'
					},
					...CONFIG_PROPS
				},
				required: ['locale'],
				additionalProperties: false
			},
			minItems: 1
		}
	},
	additionalProperties: false
}