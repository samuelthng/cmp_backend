import Knex from 'knex';
import { generateData } from './utilities';

export const tableName = 'submissions';

export const knex = Knex({
	client: 'sqlite3',
	connection: { filename: ':memory:' },
	useNullAsDefault: true,
	debug: true,
});

export const sqliteUUID = () =>
	knex.raw(
		`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`
	);

const createTableIfNotExists = async (tableName) => {
	const exists = await knex.schema.hasTable(tableName);
	if (exists) return false;
	try {
		console.log('Creating table...');
		await knex.schema.createTable(tableName, table => {
			table.uuid('id').primary().defaultTo(sqliteUUID());
			table.dateTime('timestamp').defaultTo(knex.fn.now());
			table.string('name', 500);
			table.float('temperature').checkBetween([30, 45]);
			table.boolean('symptoms');
			table.boolean('recentContact');
		});
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};


const createAndSeed = async (entries = 5, table = tableName) => {
	if (await createTableIfNotExists(table)) {
		const data = generateData(entries);
		try {
			console.log('Inserting data...');
			const [count] = await knex.batchInsert(table, data);
			console.log(`Inserted ${count} entries`);
			return true;
		} catch (error) {
			console.error(error);
		}
	}
	return false;
}

const onStart = () => createAndSeed();

onStart();
