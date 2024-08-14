import { date } from './src/index.mjs'

date.add({ 
	locale: 'mx-MX', 
	timezone: 'America/Mexico_City',
	withTimezone: true 
})
console.log(date.format(new Date()))