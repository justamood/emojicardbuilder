const infoPreviewReplacements = {
	name: "Name",
	desc: "Description",
	emoji: "Emoji",
	basehealth: "Base Health",
	baseintl: "Base Intelligence",
	class: "Class",
	cardclassoffense: "Offense",
	cardclasssupport: "Support",
	cardclassdefense: "Defense",
	rank: "Rank",
	cardrankstarter: "Starter",
	cardrankbeginner: "Beginner",
	cardrankintermediate: "Intermediate",
	cardrankskilled: "Skilled",
	cardrankmaster: "Master",
	cardrankevent: "Event",
	cardrankspecial: "Special",
};

const abilityPreviewReplacements = {
	super: "Super",
	name: "Name",
	type: "Type",
	abilityoffense: "Offense Ability",
	abilitysupport: "Support Ability",
	abilitycontrol: "Control Ability",
	abilitygroup: "Ability Group",
	abilityluck: "Luck Ability",
	cooldown: "Cooldown",
	intllocked: "Intelligence Locked",
	intllockvalue: "Intelligence Required",
	parameters: "Parameters",
	bad: "Bad",
	good: "Good",
	chance: "Chance",
	groupedAbilities: "Grouped Abilities",
	form: "Form",
	abilityoffensedirect: "Damage",
	abilityoffenseintelligence: "Intelligence Damage",
	damagetype: "Damage Type",
	damage: "Damage",
	abilityoffensedebuff: "Damage Debuff",
	debufftype: "Debuff Type",
	debuff: "Debuff",
	abilitysupporthealing: "Healing",
	healtype: "Heal Type",
	heal: "Heal",
	cantargetdead: "Can Target Dead",
	abilitysupportintelligence: "Intelligence Increase",
	increasetype: "Heal Type",
	increase: "Heal",
	abilitysupportboost: "Damage Boost",
	boosttype: "Boost Type",
	boost: "Boost",
	abilitycontrolstun: "Stun",
	abilitycontrolturnskip: "Turn Skip",
	abilitycontrolremovedebuffs: "Remove Debuffs",
	abilitycontrolremoveboosts: "Remove Boosts",

	lastsfor: "Lasts For",
	percent: "Percent",
	percenttotal: "Percent Of Total",
	percentlost: "Percent Of Lost",
	fixed: "Fixed Value",
	deck: "Applied To Whole Deck",
	target: "Targets",
	opponent: "Opponent",
	self: "Self",
};

const abilityPreviewTemplates = {
	title: (name, type) => `<b>${name} | ${type}</b>`,
	cooldown: (cooldown) =>
		cooldown > 0
			? `<em>Has a cooldown of ${cooldown} turn(s)</em>`
			: `<em>Has no cooldown</em>`,
	intllocked: (isIntllocked, intllockvalue) =>
		isIntllocked
			? `<em>Requires at least ${intllockvalue} intelligence</em>`
			: "<em>Not intelligence locked</em>",
	luck: (chance, bad, badType, good, goodType) =>
		`Bad Ability <em>(has a ${chance}% chance of occuring)</em>:<br/>${
			badType !== "abilitygroup" ? `&ensp;${bad}` : bad
		}<br/>Good Ability <em>(has a ${
			100 - chance
		}% chance of occuring)</em>:<br/>${
			goodType !== "abilitygroup" ? `&ensp;${good}` : good
		}`,
	group: (...abilities) => abilities.map((v) => `&ensp;${v}`).join("<br/>"),
	offensedamage: (parameters) => {
		const { damagetype, damage, deck, target } = parameters;
		let preview = "";

		if (damagetype === "fixed") preview += `Takes away ${damage} health `;
		else if (damagetype === "percent")
			preview += `Takes away ${damage}% of remaining health `;

		if (deck) preview += "from all cards ";
		else preview += "from a card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	offenseintelligence: (parameters) => {
		const { damagetype, damage, deck, target } = parameters;

		let preview = "";

		if (damagetype === "fixed") preview += `Takes away ${damage} intelligence `;
		else if (damagetype === "percent")
			preview += `Takes away ${damage}% of total intelligence `;

		if (deck) preview += "from all cards ";
		else preview += "from a card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	offensedebuff: (parameters) => {
		const { debufftype, debuff, deck, target, lastsfor } = parameters;
		let preview = "";

		if (debufftype === "fixed")
			preview += `Gives a -${debuff} damage debuff for ${lastsfor} turns(s) `;
		else if (debufftype === "percent")
			preview += `Gives a -${debuff}% damage debuff for ${lastsfor} turns(s) `;

		if (deck) preview += "to all cards ";
		else preview += "to a card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	supporthealing: (parameters) => {
		const { healtype, heal, deck, target, cantargetdead } = parameters;

		let preview = "";

		if (healtype === "fixed") preview += `Gives ${heal} health `;
		else if (healtype === "percenttotal")
			preview += `Gives an extra ${heal}% of total health `;
		else if (healtype === "percentlost")
			preview += `Gives ${heal}% of lost health back `;

		if (deck)
			preview += `to all cards ${
				cantargetdead
					? "<em>(Including dead cards)</em> "
					: "<em>(Not including dead cards)</em> "
			} `;
		else
			preview += `to a card ${
				cantargetdead
					? "<em>(May be dead)</em> "
					: "<em>(May not be dead)</em> "
			} `;

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	supportintelligence: (parameters) => {
		const { increasetype, increase, deck, target } = parameters;

		let preview = "";

		if (increasetype === "fixed") preview += `Gives ${increase} intelligence `;
		else if (increasetype === "percenttotal")
			preview += `Gives an extra ${increase}% of current intelligence `;
		else if (increasetype === "percentlost")
			preview += `Gives ${increase}% of lost intelligence back `;

		if (deck) preview += "to all cards ";
		else preview += "to a card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	supportboost: (parameters) => {
		const { boosttype, boost, deck, target, lastsfor } = parameters;

		let preview = "";

		if (boosttype === "fixed")
			preview += `Gives a +${boost} damage boost for ${lastsfor} turns(s) `;
		else if (boosttype === "percent")
			preview += `Gives a +${boost}% damage boost for ${lastsfor} turns(s) `;

		if (deck) preview += "to all cards ";
		else preview += "to a card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	controlstun: (parameters) => {
		const { lastsfor, target } = parameters;

		return target === "opponent"
			? `Stuns a card in the opponent's deck for ${lastsfor} turn(s)`
			: `Stuns a card in the user's deck for ${lastsfor} turn(s)`;
	},
	controlturnskip: (parameters) => {
		const { lastsfor, target } = parameters;

		return target === "opponent"
			? `Skips the opponent's next ${lastsfor} turn(s)`
			: `Skips the user's next ${lastsfor} turn(s)`;
	},
	controlremovedebuffs: (parameters) => {
		const { deck, target } = parameters;

		let preview = "";

		if (deck) preview += "Removes all debuffs from all cards ";
		else preview += "Removes all debuffs from a single card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
	controlremoveboosts: (parameters) => {
		const { deck, target } = parameters;

		let preview = "";

		if (deck) preview += "Removes all boosts from all cards ";
		else preview += "Removes all boosts from a single card ";

		if (target === "opponent") preview += "in the opponent's deck";
		else if (target === "self") preview += "in the user's deck";

		return preview;
	},
};
