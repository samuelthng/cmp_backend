import { Router } from 'express';
import { knex, sqliteUUID, tableName } from '../tmpSqlite';

const router = Router();

router.post('/submit', async function(req, res, next) {
  const { name, temperature, symptoms, recentContact } = req.body;
  console.log(req.body);
  if ([name, temperature, symptoms, recentContact].includes(undefined)) {
    return res.status(400).send('Missing required fields');
	}
  const inserted = await knex(tableName).insert({ name, temperature, symptoms, recentContact, id: sqliteUUID() });
  if (inserted.length === 1) {
    res.status(201).send('Submission successful');
  } else {
    res.status(500).send('Submission failed');
  }
});

router.get('/submission', async function (req, res, next) {
	const submissions = await knex.select('*').from(tableName);
	res.send(submissions);
});

module.exports = router;
