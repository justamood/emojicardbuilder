const steps = document.querySelectorAll(".step");
const forms = document.querySelectorAll(".needs-validation");
const step4 = document.getElementById("step4");
const notes = document.getElementById("notes");

let currentStep = 0;

forms.forEach((form) => {
	form.addEventListener(
		"submit",
		(event) => {
			if (!form.checkValidity()) {
				event.preventDefault();
				event.stopPropagation();
			}

			form.classList.add("was-validated");
		},
		false
	);
	form.addEventListener("click", (event) => {
		if (!event.target.classList.contains("doesNotHideValidation"))
			form.classList.remove("was-validated");
	});
});

function nextFormStep() {
	const oldStep = currentStep;
	const oldForm = forms.item(oldStep);
	if (!oldForm.checkValidity()) {
		oldForm.reportValidity();
		event.stopPropagation();
		oldForm.classList.add("was-validated");
	} else if (oldForm) {
		currentStep = Math.min(currentStep + 1, 2);
		steps.forEach((step) => {
			step.classList.add("hidden");
		});
		steps.item(currentStep).classList.remove("hidden");
	}
}
function prevFormStep() {
	currentStep = Math.max(currentStep - 1, 0);
	steps.forEach((step) => {
		step.classList.add("hidden");
	});
	steps.item(currentStep).classList.remove("hidden");
}

function goToValidateStep() {
	notes.innerHTML = `
						<p id="carderrors"></p>
						<p id="cardpreview"></p>
						<pre class="prettyprint"><code id="cardjson" class="lang-json"></code></pre>
					`;
	currentStep = 3;
	steps.forEach((step) => {
		step.classList.add("hidden");
	});
	step4.classList.remove("hidden");
	let grandArray = [];
	forms.forEach(
		(form) => (grandArray = grandArray.concat([...new FormData(form)]))
	);

	const res = api(grandArray);

	notes.classList.remove("hidden");
	const jsoncodeblock = document.getElementById("cardjson");
	jsoncodeblock.innerHTML = JSON.stringify(res, null, 4);
	PR.prettyPrint();
}

/**
 *
 * @param {[string,string][]} grandArray
 */
function api(grandArray) {
	const grandObject = { info: {}, abilities: [], super: {} };

	for (const [rawKey, rawValue] of grandArray) {
		const idx = rawKey.charAt(7);
		const subidx = rawKey.charAt(9);
		const subsubidx = rawKey.charAt(11);
		const key = rawKey
			.replace("card", "")
			.replace(`ability${idx}.${subidx}.${subsubidx}`, "");
		let value = parseInt(rawValue) ? parseInt(rawValue) : rawValue;

		if (rawKey.startsWith("card")) grandObject.info[key] = value;
		if (rawKey.startsWith("abilityS")) {
			if (subidx != 0) {
				if (!grandObject.super[subidx]) {
					grandObject.super[subidx] = {
						[key]: value,
					};
				} else {
					if (subsubidx != 0) {
						if (!grandObject.super[subidx][subsubidx]) {
							grandObject.super[subidx][subsubidx] = {
								[key]: value,
							};
						} else {
							grandObject.super[subidx][subsubidx][key] = value;
						}
					} else {
						grandObject.super[subidx][key] = value;
					}
				}
			} else {
				grandObject.super[key] = value;
			}
		} else if (rawKey.startsWith("ability")) {
			if (!grandObject.abilities[idx]) {
				grandObject.abilities.push({
					[key]: value,
				});
			} else {
				if (subidx != 0) {
					if (!grandObject.abilities[idx][subidx]) {
						grandObject.abilities[idx][subidx] = {
							[key]: value,
						};
					} else {
						if (subsubidx != 0) {
							if (!grandObject.abilities[idx][subidx][subsubidx]) {
								grandObject.abilities[idx][subidx][subsubidx] = {
									[key]: value,
								};
							} else {
								grandObject.abilities[idx][subidx][subsubidx][key] = value;
							}
						} else {
							grandObject.abilities[idx][subidx][key] = value;
						}
					}
				} else {
					grandObject.abilities[idx][key] = value;
				}
			}
		}
	}

	const formattedAbilities = [];
	for (const ability of grandObject.abilities)
		formattedAbilities.push(formatAbility(ability));
	grandObject.abilities = formattedAbilities;
	grandObject.super = formatAbility(grandObject.super);
	return grandObject;
}

function formatAbility(ability) {
	let formattedAbility = { ...ability, parameters: {} };
	if (ability.type === "abilityluck") {
		formattedAbility.parameters.bad = formatAbility(ability["1"]);
		formattedAbility.parameters.good = formatAbility(ability["2"]);
		delete formattedAbility["1"];
		delete formattedAbility["2"];
		delete formattedAbility.chance;
		formattedAbility.parameters.chance = ability.chance;
	} else if (ability.type === "abilitygroup") {
		for (const key in ability) {
			if (Object.hasOwnProperty.call(ability, key)) {
				if (key.match(/\d+/)) {
					if (!formattedAbility.parameters.groupedAbilities)
						formattedAbility.parameters.groupedAbilities = [];
					formattedAbility.parameters.groupedAbilities.push(
						formatAbility(ability[key])
					);
					delete formattedAbility[key];
				}
			}
		}
	} else {
		for (const key in ability) {
			if (Object.hasOwnProperty.call(ability, key)) {
				if (
					![
						"parameters",
						"name",
						"type",
						"cooldown",
						"intllocked",
						"intllockvalue",
						"form",
					].includes(key)
				) {
					delete formattedAbility[key];
					formattedAbility.parameters[key] = ability[key];
				}
			}
		}
	}
	if (formattedAbility.intllocked !== "on") {
		delete formattedAbility["intllockvalue"];
		formattedAbility.intllocked = false;
	} else formattedAbility.intllocked = true;
	return formattedAbility;
}
