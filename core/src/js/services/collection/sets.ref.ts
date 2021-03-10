import { ReferenceSet } from '../../models/collection/reference-set';

export const standardSets: readonly string[] = [
	'darkmoon_races',
	'darkmoon_faire',
	'scholomance',
	'black_temple',
	'demon_hunter_initiate',
	'yod',
	'dragons',
	'uldum',
	'dalaran',
	'expert1',
	'core',
];

export const sets: readonly ReferenceSet[] = [
	{
		id: 'darkmoon_races',
		name: 'Darkmoon Races',
		launchDate: new Date('2021-01-21'),
	},
	{
		id: 'darkmoon_faire',
		name: 'Darkmoon Faire',
		launchDate: new Date('2020-11-17'),
	},
	{
		id: 'scholomance',
		name: 'Scholomance Academy',
		launchDate: new Date('2020-08-06'),
	},
	{
		id: 'black_temple',
		name: 'Ashes of Outland',
		launchDate: new Date('2020-04-07'),
	},
	{
		id: 'demon_hunter_initiate',
		name: 'Demon Hunter Initiate',
		launchDate: new Date('2020-04-02'),
	},
	{
		id: 'yod',
		name: "Galakrond's Awakening",
		launchDate: new Date('2020-01-21'),
	},
	{
		id: 'dragons',
		name: 'Descent of Dragons',
		launchDate: new Date('2019-12-10'),
	},
	{
		id: 'uldum',
		name: 'Saviors of Uldum',
		launchDate: new Date('2019-08-06'),
	},
	{
		id: 'dalaran',
		name: 'Rise of Shadows',
		launchDate: new Date('2019-04-09'),
	},
	{
		id: 'troll',
		name: "Rastakhan's Rumble",
		launchDate: new Date('2018-12-04'),
	},
	{
		id: 'boomsday',
		name: 'The Boomsday Project',
		launchDate: new Date('2018-08-07'),
	},
	{
		id: 'gilneas',
		name: 'The Witchwood',
		launchDate: new Date('2018-04-12'),
	},
	{
		id: 'lootapalooza',
		name: 'Kobolds and Catacombs',
		launchDate: new Date('2017-12-07'),
	},
	{
		id: 'icecrown',
		name: 'Knights of the Frozen Throne',
		launchDate: new Date('2017-08-10'),
	},
	{
		id: 'ungoro',
		name: "Journey to Un'Goro",
		launchDate: new Date('2017-04-06'),
	},
	{
		id: 'hof',
		name: 'Hall of Fame',
		launchDate: new Date('2017-04-04'),
	},
	{
		id: 'gangs',
		name: 'Mean Streets of Gadgetzan',
		launchDate: new Date('2016-12-1'),
	},
	{
		id: 'kara',
		name: 'One Night in Karazhan',
		launchDate: new Date('2018-08-11'),
	},
	{
		id: 'og',
		name: 'Whispers of the Old Gods',
		launchDate: new Date('2016-04-26'),
	},
	{
		id: 'loe',
		name: 'League of Explorers',
		launchDate: new Date('2015-11-12'),
	},
	{
		id: 'tgt',
		name: 'The Grand Tournament',
		launchDate: new Date('2015-08-24'),
	},
	{
		id: 'brm',
		name: 'Blackrock Mountain',
		launchDate: new Date('2015-04-02'),
	},
	{
		id: 'gvg',
		name: 'Goblins vs Gnomes',
		launchDate: new Date('2014-12-08'),
	},
	{
		id: 'naxx',
		name: 'Naxxramas',
		launchDate: new Date('2014-07-22'),
	},
	{
		id: 'expert1',
		name: 'Classic',
		launchDate: new Date('2014-03-11'),
	},
	{
		id: 'core',
		name: 'Basic',
		launchDate: new Date('2014-03-11'),
	},
];