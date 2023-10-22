const steps = document.querySelectorAll(".step");
const forms = document.querySelectorAll(".needs-validation");
const step4 = document.getElementById("step4");
const notes = document.getElementById("notes");
const emojiselection = document.getElementById("emojiselection");
const emojipicker = document.getElementById("emojipicker");
const selectedemojiimage = document.getElementById("selectedemojiimage");
const cardemoji = document.getElementById("cardemoji");

let currentStep = 0;
let copyvalue = "";

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
		currentStep = Math.min(currentStep + 1, 3);
		steps.forEach((step) => {
			step.classList.add("hidden");
		});
		steps.item(currentStep).classList.remove("hidden");
		if (currentStep == 3) goToValidateStep();
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
						<div class="accordion" id="cardpreview"></div>
						<div class="cardjsoncontainer">
							<button
								class="btn btn-primary btn-block"
								type="button"
								id="copyjson"
								onclick="navigator.clipboard.writeText(copyvalue)"
							>
								Copy JSON
							</button>
							<pre
								class="prettyprint"
							><code id="cardjson" class="lang-json"></code></pre>
							<button
								class="btn btn-primary btn-block"
								type="button"
								id="copyjson"
								onclick="navigator.clipboard.writeText(copyvalue)"
							>
								Copy JSON
							</button>
						</div>
					`;
	steps.forEach((step) => {
		step.classList.add("hidden");
	});
	let grandArray = [];
	forms.forEach(
		(form) => (grandArray = grandArray.concat([...new FormData(form)]))
	);

	const res = api(grandArray);

	notes.classList.remove("hidden");
	const jsoncodeblock = document.getElementById("cardjson");
	copyvalue = JSON.stringify(res, null, 4);
	generatePreview(res);
	jsoncodeblock.innerHTML = copyvalue;
	PR.prettyPrint();
	step4.classList.remove("hidden");
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
		let value = !isNaN(Number(rawValue)) ? Number(rawValue) : rawValue;

		if (rawKey === "cardemoji") grandObject.info[key] = JSON.parse(value);
		else if (rawKey.startsWith("card")) grandObject.info[key] = value;
		else if (rawKey.startsWith("abilityS")) {
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

function formatAbility(ability, isChildAbility) {
	let formattedAbility = { ...ability, parameters: {} };
	if (ability.type === "abilityluck") {
		formattedAbility.parameters.bad = formatAbility(ability["1"], true);
		formattedAbility.parameters.good = formatAbility(ability["2"], true);
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
						formatAbility(ability[key], true)
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
					let value = ability[key];
					formattedAbility.parameters[key] = value;
				}
			}
		}
		if (
			!["abilitycontrolturnskip", "abilitycontrolstun"].includes(
				formattedAbility.form
			)
		) {
			if (!formattedAbility.parameters.deck)
				formattedAbility.parameters.deck = false;
			else formattedAbility.parameters.deck = true;
		}
		if (formattedAbility.form === "abilitysupporthealing") {
			if (!formattedAbility.parameters.cantargetdead)
				formattedAbility.parameters.cantargetdead = false;
			else formattedAbility.parameters.cantargetdead = true;
		}
	}
	if (!isChildAbility) {
		if (formattedAbility.intllocked !== "on") {
			delete formattedAbility["intllockvalue"];
			formattedAbility.intllocked = false;
		} else formattedAbility.intllocked = true;
	}
	return formattedAbility;
}

function generatePreview(cardJSON) {
	let infoPreview = generatePreviewInfo(cardJSON.info).join("<br/>");
	let abilitiesPreview = cardJSON.abilities
		.map((v) => generatePreviewAbility(v, false, false))
		.join('<div class="seperatorinputs"></div>');
	let superPreview = generatePreviewAbility(cardJSON.super, false, true);

	document.getElementById("cardpreview").innerHTML = `
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#cardpreviewinfo"
							>
								Basic Information
							</button>
						</h2>
						<div
							class="accordion-collapse collapse show"
							data-bs-parent="#cardpreview"
							id="cardpreviewinfo"
						>
							<div class="accordion-body">
								${infoPreview}
							</div>
						</div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#cardpreviewabilities"
							>
								Abilities
							</button>
						</h2>
						<div
							class="accordion-collapse collapse"
							data-bs-parent="#cardpreview"
							id="cardpreviewabilities"
						>
							<div class="accordion-body">
								${abilitiesPreview}
							</div>
						</div>
					</div>
					<div class="accordion-item">
						<h2 class="accordion-header">
							<button
								class="accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#cardpreviewsuper"
							>
								Super Ability
							</button>
						</h2>
						<div
							class="accordion-collapse collapse"
							data-bs-parent="#cardpreview"
							id="cardpreviewsuper"
						>
							<div class="accordion-body">
								${superPreview}
							</div>
						</div>
					</div>
				`;
}

function generatePreviewInfo(cardJSONInfo) {
	let preview = [];
	for (const key in cardJSONInfo) {
		if (Object.hasOwnProperty.call(cardJSONInfo, key)) {
			let value = cardJSONInfo[key];
			if (value == "") value = "N/A";
			if (key === "emoji")
				value = `<span id="previewemoji"><img id="previewemojimage" src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${
					value.unified
				}.svg" onerror="this.src = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${
					value.unified.split("-")[0]
				}.svg'"/> <em id="previewemojitext">(${value.id})</em></span>`;
			preview.push(
				`<b>${infoPreviewReplacements[key]}:</b> ${
					infoPreviewReplacements[value] || value
				}`
			);
		}
	}
	return preview;
}

function generatePreviewAbility(
	cardJSONAbility,
	isChildAbility,
	isSuperAbility
) {
	let preview = [
		abilityPreviewTemplates.title(
			cardJSONAbility.name,
			abilityPreviewReplacements[cardJSONAbility.type]
		),
	];
	if (cardJSONAbility.type === "abilityluck")
		preview.push(
			abilityPreviewTemplates.luck(
				cardJSONAbility.parameters.chance,
				generatePreviewAbility(cardJSONAbility.parameters.bad, true),
				cardJSONAbility.parameters.bad.type,
				generatePreviewAbility(cardJSONAbility.parameters.good, true),
				cardJSONAbility.parameters.good.type
			)
		);
	else if (cardJSONAbility.type === "abilitygroup")
		preview.push(
			abilityPreviewTemplates.group(
				...cardJSONAbility.parameters.groupedAbilities.map((v) =>
					generatePreviewAbility(v, true)
				)
			)
		);
	else
		preview.push(
			abilityPreviewTemplates[cardJSONAbility.form.substring(7)](
				cardJSONAbility.parameters
			)
		);
	if (!isChildAbility) {
		if (!isSuperAbility)
			preview[1] +=
				"<br/>" + abilityPreviewTemplates.cooldown(cardJSONAbility.cooldown);
		preview[1] +=
			"<br/>" +
			abilityPreviewTemplates.intllocked(
				cardJSONAbility.intllocked,
				cardJSONAbility.intllockvalue
			);
		return preview.join("<br/>");
	} else return preview[1];
}

window.addEventListener("load", () => {
	const pickerOptions = {
		onEmojiSelect: (sel) => {
			emojipicker.style.display = "none";
			const img = new Image();
			let realUni = sel.unified;
			img.src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${sel.unified}.svg`;
			img.onload = () =>
				(selectedemojiimage.src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${sel.unified}.svg`);
			img.onerror = () => {
				selectedemojiimage.src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${
					sel.unified.split("-")[0]
				}.svg`;
				realUni = sel.unified.split("-")[0];
			};

			cardemoji.value = JSON.stringify({
				id: sel.id,
				unified: realUni,
				skin: sel.skin,
			});
			cardemoji.setCustomValidity("");
			emojiselection.classList.remove("invalid");
			emojiselection.classList.add("valid");
		},
		onClickOutside: (event) => {
			if (event.target.id != "selectedemojiimage")
				emojipicker.style.display = "none";
		},
		categories: [
			"people",
			"nature",
			"foods",
			"activity",
			"places",
			"objects",
			"symbols",
			"flags",
		],
		previewEmoji: "👏",
		set: "twitter",
		skinTonePosition: "search",
		theme: "light",
		emojiVersion: 14,
		getSpritesheetURL: () =>
			"https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@14.0.0/img/twitter/sheets-256/64.png",
	};
	const picker = new EmojiMart.Picker(pickerOptions);

	emojipicker.appendChild(picker);
});
