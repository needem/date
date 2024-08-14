## Date formatter based on Intl.DateTimeFormat

```@needme/date``` offers a convenient way to format dates using multiple configurations.

*Install*
```bash
npm i --save @needem/date
```

*Basic use*
```js
import { date } from '@needme/date'

date.add({ locale: 'en-US' })

console.log(date.format(new Date()))
// should display: 04/12/1861
```

You can configure multiple formatters in one go by using the ```init``` function.

Choose which one should be used with the ```use``` function.


*Initialize with multiple locales*
```js
import { date } from '@needme/date'

date.init({
	default: 'us',
	configs: [{ 
		name: 'us',
		locale: 'en-US' 
	}, {
        locale: 'es-MX',
        timezone: 'America/Mexico_City',
        withTimezone: true
    }]	
})

date.use('mx')
date.format(new Date())
// should display: 08/14/2024, 08:39 AM CST
```