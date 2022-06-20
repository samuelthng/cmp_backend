import { faker } from '@faker-js/faker';

export const generateData = (entries, options = {}) => {
	return [...Array(entries)].map(() => {
		return {
			...(options.uuid && { id: faker.datatype.uuid() }),
			...(options.timestamp && { timestamp: faker.date.past(1) }),
			name: faker.name.findName(),
			temperature: faker.datatype.number({ min: 35, max: 40, precision: 0.1 }),
			symptoms: faker.datatype.boolean(),
			recentContact: faker.datatype.boolean(),
		};
	});
};
