const abilityControlButtonsTop = document.getElementById(
	"abilityControlButtonsTop"
);
const abilityControlButtonsBottom = document.getElementById(
	"abilityControlButtonsBottom"
);
const abilities = document.getElementById("abilities");
function newAbility() {
	const idx = findMissingID(abilities.children, 7, 0);
	if (abilities.children.length + 1 >= 10) {
		abilityControlButtonsTop.children.item(1).disabled = true;
		abilityControlButtonsBottom.children.item(1).disabled = true;
	}

	abilities.insertAdjacentHTML(
		"beforeend",
		`
			<div class="ability outline" id="ability${idx}.0.0">
				<h3>Ability #${abilities.children.length + 1}</h3>

				<label for="ability${idx}.0.0name" class="form-label" >Name</label>
				<input class="form-control" type="text" name="ability${idx}.0.0name" id="ability${idx}.0.0name" maxlength="64" required/>

				<div class="seperatorinputs"></div>
				<label for="ability${idx}.0.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.0.0type" id="ability${idx}.0.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Offense</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
					<option value="abilitygroup">Ability Group</option>
					<option value="abilityluck">Luck</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.0.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.0.0parameters"></div></div>

				<div class="seperatorinputs"></div>
				<label for="ability${idx}.0.0cooldown" class="form-label">Cooldown</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.0.0cooldown" id="ability${idx}.0.0cooldown" min="0" value="0"/><span class="input-group-text">turn(s)</span></div>
				
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.0.0intllocked" class="form-label">Intelligence Locked?</label>
				<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" name="ability${idx}.0.0intllocked" id="ability${idx}.0.0intllocked" onchange="abilityIntlLockChanged(this)" /></div>
				<div id="ability${idx}.0.0intllockvaluecontainer" class="intllockinput" style="display:none">
					<div class="seperatorinputs"></div>
					<label for="ability${idx}.0.0intllockvalue" class="form-label">Intelligence Required</label>
					<input class="form-control" type="number" step="1" name="ability${idx}.0.0intllockvalue" id="ability${idx}.0.0intllockvalue" />
				</div>
				<div class="seperatorinputs"></div>
				<button class="deleteability btn btn-danger" type="button" onclick="abilityDelete(this)" id="ability${idx}.0.0delete">Delete Ability</button>
			</div>
		`
	);

	document
		.getElementById(`ability${idx}.0.0`)
		.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
}

/**
	@param {HTMLElement} dropdown
 */
function abilityTypeChange(dropdown) {
	const value = dropdown.value;
	const idx = dropdown.name.charAt(7);
	const subidx = dropdown.name.charAt(9);
	const subsubidx = dropdown.name.charAt(11);
	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);
	dynamicinputs.innerHTML = `<div id="ability${idx}.${subidx}.${subsubidx}parameters"></div>`;
	Array.from(
		document
			.getElementById(`ability${idx}.${subidx}.${subsubidx}`)
			.getElementsByClassName("hideunlesssmthselected")
	).forEach((ele) => {
		ele.classList.remove("hideunlesssmthselected");
	});
	if (value === "abilityoffense") newOffenseAbility(dropdown.parentElement);
	else if (value === "abilitysupport")
		newSupportAbility(dropdown.parentElement);
	else if (value === "abilitycontrol")
		newControlAbility(dropdown.parentElement);
	else if (value === "abilitygroup") newAbilityGroup(dropdown.parentElement);
	else if (value === "abilityluck") newLuckAbility(dropdown.parentElement);
}
/**
	@param {HTMLElement} checkbox
 */
function abilityIntlLockChanged(checkbox) {
	const idx = checkbox.name.charAt(7);
	const subidx = checkbox.name.charAt(9);
	const subsubidx = checkbox.name.charAt(11);
	document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}intllockvaluecontainer`
	).style = checkbox.checked ? "" : "display:none";
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}intllockvalue`
	);
	input.required = checkbox.checked;
}

//-------------------------------------------------------------------

/**
	@param {HTMLElement} abilityElement
 */
function newOffenseAbility(abilityElement) {
	const idx = abilityElement.id.charAt(7);
	const subidx = abilityElement.id.charAt(9);
	const subsubidx = abilityElement.id.charAt(11);

	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);

	dynamicinputs.insertAdjacentHTML(
		"afterbegin",
		`
			<label for="ability${idx}.${subidx}.${subsubidx}form" class="form-label">Form</label>
			<select class="form-select" name="ability${idx}.${subidx}.${subsubidx}form" id="ability${idx}.${subidx}.${subsubidx}form" onchange="abilityOffenseFormChange(this)" required>
				<option hidden disabled selected value>-- Select an option --</option>
				<option value="abilityoffensedamage">Damage</option>
				<option value="abilityoffenseintelligence">Intelligence Decrease</option>
				<option value="abilityoffensedebuff">Damage Debuff</option>
			</select>
		`
	);
	dynamicinputs.insertAdjacentHTML(
		"beforeend",
		`
			<div class="seperatorinputs"></div>
			<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Target</label>
			<br/>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetopponent" value="opponent" checked/><label for="ability${idx}.${subidx}.${subsubidx}targetopponent" class="form-check-label">Opponent</label></div>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetself" value="self"/><label for="ability${idx}.${subidx}.${subsubidx}targetself" class="form-check-label">Self</label></div>
		`
	);
}
/**
	@param {HTMLElement} abilityElement
 */
function abilityOffenseFormChange(dropdown) {
	const idx = dropdown.name.charAt(7);
	const subidx = dropdown.name.charAt(9);
	const subsubidx = dropdown.name.charAt(11);
	const value = dropdown.value;
	const parameters = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}parameters`
	);
	parameters.innerHTML = "";
	if (value === "abilityoffensedamage") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-label">Damage Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}damagetype" id="ability${idx}.${subidx}.${subsubidx}damagetypefixed" value="fixed" checked onclick="abilityOffenseDamageTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-check-label">Fixed Value</label></div>
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}damagedamagepercent" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="*Percent of remaining health, not base health"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}damagetype" id="ability${idx}.${subidx}.${subsubidx}damagetypepercent" value="percent" onclick="abilityOffenseDamageTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-check-label">Percent</label></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}damage" class="form-label">Damage Amount</label>
				<div class=""><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}damage" id="ability${idx}.${subidx}.${subsubidx}damage" min="1" required/><span class="" style="display:none" id="ability${idx}.${subidx}.${subsubidx}span"></span></div>
			`
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}damagedamagepercent`
			),
			{ trigger: "hover" }
		);
	} else if (value === "abilityoffenseintelligence") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-label">Damage Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}damagetype" id="ability${idx}.${subidx}.${subsubidx}damagetypefixed" value="fixed" checked onclick="abilityOffenseDamageTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-check-label">Fixed Value</label></div>
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}damageintlpercent" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="*Percent of remaining intelligence, not base intelligence"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}damagetype" id="ability${idx}.${subidx}.${subsubidx}damagetypepercent" value="percent" onclick="abilityOffenseDamageTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}damagetype" class="form-check-label">Percent</label></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}damage" class="form-label">Damage Amount</label>
				<div class=""><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}damage" id="ability${idx}.${subidx}.${subsubidx}damage" min="1" required/><span class="" style="display:none" id="ability${idx}.${subidx}.${subsubidx}span"></span></div>
			`
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}damageintlpercent`
			),
			{ trigger: "hover" }
		);
	} else if (value === "abilityoffensedebuff") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}debufftype" class="form-label">Debuff Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}debufftype" id="ability${idx}.${subidx}.${subsubidx}debufftypepercent" value="percent" checked onclick="abilityOffenseDebuffTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}debufftype" class="form-check-label">Percent</label></div>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}debufftype" id="ability${idx}.${subidx}.${subsubidx}debufftypefixed" value="fixed" onclick="abilityOffenseDebuffTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}debufftype" class="form-check-label">Fixed Value</label></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}debuff" class="form-label">Debuff Amount</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}debuff" id="ability${idx}.${subidx}.${subsubidx}debuff" min="1" max="100" required/><span class="input-group-text" id="ability${idx}.${subidx}.${subsubidx}span">%</span></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}lastsfor" class="form-label">Lasts for</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}lastsfor" id="ability${idx}.${subidx}.${subsubidx}lastsfor" min="1" required /><span class="input-group-text">turn(s)</span></div>
			`
		);
	}

	parameters.insertAdjacentHTML(
		"beforeend",
		`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Apply to whole deck?</label>
				<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" name="ability${idx}.${subidx}.${subsubidx}deck" id="ability${idx}.${subidx}.${subsubidx}deck" /></div>
			`
	);
}

/**
	@param {HTMLElement} radio
 */
function abilityOffenseDamageTypeChange(radio) {
	const idx = radio.name.charAt(7);
	const subidx = radio.name.charAt(9);
	const subsubidx = radio.name.charAt(11);
	const value = radio.value;
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}damage`
	);
	const span = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}span`
	);
	if (value === "percent") {
		input.setAttribute("max", "100");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "fixed") {
		input.removeAttribute("max");
		span.innerHTML = "";
		span.style.display = "none";
		span.classList.remove("input-group-text");
		span.parentElement.classList.remove("input-group");
	}
}

/**
	@param {HTMLElement} radio
 */
function abilityOffenseDebuffTypeChange(radio) {
	const idx = radio.name.charAt(7);
	const subidx = radio.name.charAt(9);
	const subsubidx = radio.name.charAt(11);
	const value = radio.value;
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}debuff`
	);
	const span = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}span`
	);
	if (value === "percent") {
		input.setAttribute("max", "100");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "fixed") {
		input.removeAttribute("max");
		span.innerHTML = "";
		span.style.display = "none";
		span.classList.remove("input-group-text");
		span.parentElement.classList.remove("input-group");
	}
}

//-------------------------------------------------------------------

/**
	@param {HTMLElement} abilityElement
 */
function newSupportAbility(abilityElement) {
	const idx = abilityElement.id.charAt(7);
	const subidx = abilityElement.id.charAt(9);
	const subsubidx = abilityElement.id.charAt(11);
	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);

	dynamicinputs.insertAdjacentHTML(
		"afterbegin",
		`
			<label for="ability${idx}.${subidx}.${subsubidx}form" class="form-label">Form</label>
			<select class="form-select" name="ability${idx}.${subidx}.${subsubidx}form" id="ability${idx}.${subidx}.${subsubidx}form" onchange="abilitySupportFormChange(this)" required>
				<option hidden disabled selected value>-- Select an option --</option>
				<option value="abilitysupporthealing">Healing</option>
				<option value="abilitysupportintelligence">Intelligence Increase</option>
				<option value="abilitysupportboost">Damage Boost</option>
			</select>
		`
	);
	dynamicinputs.insertAdjacentHTML(
		"beforeend",
		`
			<div class="seperatorinputs"></div>
			<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Target</label>
			<br/>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetopponent" value="opponent" checked/><label for="ability${idx}.${subidx}.${subsubidx}targetopponent" class="form-check-label">Opponent</label></div>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetself" value="self"/><label for="ability${idx}.${subidx}.${subsubidx}targetself" class="form-check-label">Self</label></div>
		`
	);
}
/**
	@param {HTMLElement} abilityElement
 */
function abilitySupportFormChange(dropdown) {
	const idx = dropdown.name.charAt(7);
	const subidx = dropdown.name.charAt(9);
	const subsubidx = dropdown.name.charAt(11);
	const value = dropdown.value;
	const parameters = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}parameters`
	);
	parameters.innerHTML = "";
	if (value === "abilitysupporthealing") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}healtype" class="form-label">Heal Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}healtype" id="ability${idx}.${subidx}.${subsubidx}healtypefixed" value="fixed" checked onclick="abilitySupportHealTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}healtype" class="form-check-label">Fixed Value</label></div>
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}supporthealpercenttotalcontainer" data-bs-html="true" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="Percent of the amount of total amount of health the card has" > <input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}healtype" id="ability${idx}.${subidx}.${subsubidx}healtypepercenttotal" value="percenttotal" onclick="abilitySupportHealTypeChange(this)" /><label for="ability${idx}.${subidx}.${subsubidx}healtype" class="form-check-label" >Percent of Total</label > </div> 
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}supporthealpercentlostcontainer" data-bs-html="true" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="Percent of the amount of health that the card lost <em>(Becomes irrelevant if the card hasn't lost any health or if its current health exceeds the base health of the card)</em>" > <input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}healtype" id="ability${idx}.${subidx}.${subsubidx}healtypepercentlost" value="percentlost" onclick="abilitySupportHealTypeChange(this)" /><label for="ability${idx}.${subidx}.${subsubidx}healtype" class="form-check-label" >Percent of Lost</label > </div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}heal" class="form-label">Heal Amount</label>
				<div class=""><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}heal" id="ability${idx}.${subidx}.${subsubidx}heal" min="1" required/><span class="" style="display:none" id="ability${idx}.${subidx}.${subsubidx}span"></span></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}cantargetdead" class="form-label">Can Target Dead Cards?</label>
				<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" name="ability${idx}.${subidx}.${subsubidx}cantargetdead" id="ability${idx}.${subidx}.${subsubidx}cantargetdead" /></div>
			`
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}supporthealpercenttotalcontainer`
			),
			{ trigger: "hover" }
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}supporthealpercentlostcontainer`
			),
			{ trigger: "hover" }
		);
	} else if (value === "abilitysupportintelligence") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}increasetype" class="form-label">Increase Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}increasetype" id="ability${idx}.${subidx}.${subsubidx}increasetypefixed" value="fixed" checked onclick="abilitySupportIncreaseTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}increasetype" class="form-check-label">Fixed Value</label></div>
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}supportincreasepercenttotalcontainer" data-bs-html="true" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="Percent of the amount of total amount of intelligence the card has" > <input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}increasetype" id="ability${idx}.${subidx}.${subsubidx}increasetypepercenttotal" value="percenttotal" onclick="abilitySupportIncreaseTypeChange(this)" /><label for="ability${idx}.${subidx}.${subsubidx}increasetype" class="form-check-label" >Percent of Total</label > </div> 
				<div class="form-check form-check-inline" id="ability${idx}.${subidx}.${subsubidx}supportincreasepercentlostcontainer" data-bs-html="true" data-bs-custom-class="percenttooltip" data-toggle="tooltip" title="Percent of the amount of intelligence that the card lost <em>(Becomes irrelevant if the card hasn't lost any intelligence or if its current intelligence exceeds the base intelligence of the card)</em>" > <input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}increasetype" id="ability${idx}.${subidx}.${subsubidx}increasetypepercentlost" value="percentlost" onclick="abilitySupportIncreaseTypeChange(this)" /><label for="ability${idx}.${subidx}.${subsubidx}increasetype" class="form-check-label" >Percent of Lost</label > </div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}increase" class="form-label">Increase Amount</label>
				<div class=""><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}increase" id="ability${idx}.${subidx}.${subsubidx}increase" min="1" required/><span class="" style="display:none" id="ability${idx}.${subidx}.${subsubidx}span"></span></div>
			`
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}supportincreasepercenttotalcontainer`
			),
			{ trigger: "hover" }
		);
		new bootstrap.Tooltip(
			document.getElementById(
				`ability${idx}.${subidx}.${subsubidx}supportincreasepercentlostcontainer`
			),
			{ trigger: "hover" }
		);
	} else if (value === "abilitysupportboost") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}boosttype" class="form-label">Boost Type</label>
				<br/>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}boosttype" id="ability${idx}.${subidx}.${subsubidx}boosttypepercent" value="percent" checked onclick="abilitySupportBoostTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}boosttype" class="form-check-label">Percent</label></div>
				<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}boosttype" id="ability${idx}.${subidx}.${subsubidx}boosttypefixed" value="fixed" onclick="abilitySupportBoostTypeChange(this)"/><label for="ability${idx}.${subidx}.${subsubidx}boosttype" class="form-check-label">Fixed Value</label></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}boost" class="form-label">Boost Amount</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}boost" id="ability${idx}.${subidx}.${subsubidx}boost" min="1" required/><span class="input-group-text" id="ability${idx}.${subidx}.${subsubidx}span">%</span></div>
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}lastsfor" class="form-label">Lasts for</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}lastsfor" id="ability${idx}.${subidx}.${subsubidx}lastsfor" min="1" required /><span class="input-group-text">turn(s)</span></div>
			`
		);
	}
	parameters.insertAdjacentHTML(
		"beforeend",
		`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Apply to whole deck?</label>
				<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" name="ability${idx}.${subidx}.${subsubidx}deck" id="ability${idx}.${subidx}.${subsubidx}deck" /></div>
			`
	);
}

/**
	@param {HTMLElement} radio
 */
function abilitySupportHealTypeChange(radio) {
	const idx = radio.name.charAt(7);
	const subidx = radio.name.charAt(9);
	const subsubidx = radio.name.charAt(11);
	const value = radio.value;
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}heal`
	);
	const span = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}span`
	);
	if (value === "percentlost") {
		input.setAttribute("max", "100");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "percenttotal") {
		input.removeAttribute("max");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "fixed") {
		input.removeAttribute("max");
		span.innerHTML = "";
		span.style.display = "none";
		span.classList.remove("input-group-text");
		span.parentElement.classList.remove("input-group");
	}
}

/**
	@param {HTMLElement} radio
 */
function abilitySupportIncreaseTypeChange(radio) {
	const idx = radio.name.charAt(7);
	const subidx = radio.name.charAt(9);
	const subsubidx = radio.name.charAt(11);
	const value = radio.value;
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}increase`
	);
	const span = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}span`
	);
	if (value === "percentlost") {
		input.setAttribute("max", "100");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "percenttotal") {
		input.removeAttribute("max");
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "fixed") {
		input.removeAttribute("max");
		span.innerHTML = "";
		span.style.display = "none";
		span.classList.remove("input-group-text");
		span.parentElement.classList.remove("input-group");
	}
}

/**
	@param {HTMLElement} radio
 */
function abilitySupportBoostTypeChange(radio) {
	const idx = radio.name.charAt(7);
	const subidx = radio.name.charAt(9);
	const subsubidx = radio.name.charAt(11);
	const value = radio.value;
	const input = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}boost`
	);
	const span = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}span`
	);
	if (value === "percent") {
		span.innerHTML = "%";
		span.style.display = "inline";
		span.classList.add("input-group-text");
		span.parentElement.classList.add("input-group");
	} else if (value === "fixed") {
		span.innerHTML = "";
		span.style.display = "none";
		span.classList.remove("input-group-text");
		span.parentElement.classList.remove("input-group");
	}
}

//-------------------------------------------------------------------

/**
	@param {HTMLElement} abilityElement
 */
function newControlAbility(abilityElement) {
	const idx = abilityElement.id.charAt(7);
	const subidx = abilityElement.id.charAt(9);
	const subsubidx = abilityElement.id.charAt(11);
	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);

	dynamicinputs.insertAdjacentHTML(
		"afterbegin",
		`
			<label for="ability${idx}.${subidx}.${subsubidx}form" class="form-label">Form</label>
			<select class="form-select" name="ability${idx}.${subidx}.${subsubidx}form" id="ability${idx}.${subidx}.${subsubidx}form" onchange="abilityControlFormChange(this)" required>
				<option hidden disabled selected value>-- Select an option --</option>
				<option value="abilitycontrolstun">Stun</option>
				<option value="abilitycontrolturnskip">Turn Skip</option>
				<option value="abilitycontrolremovedebuffs">Remove Debuffs</option>
				<option value="abilitycontrolremoveboosts">Remove Boosts</option>
			</select>
		`
	);
	dynamicinputs.insertAdjacentHTML(
		"beforeend",
		`
			<div class="seperatorinputs"></div>
			<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Target</label>
			<br/>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetopponent" value="opponent" checked/><label for="ability${idx}.${subidx}.${subsubidx}targetopponent" class="form-check-label">Opponent</label></div>
			<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="ability${idx}.${subidx}.${subsubidx}target" id="ability${idx}.${subidx}.${subsubidx}targetself" value="self"/><label for="ability${idx}.${subidx}.${subsubidx}targetself" class="form-check-label">Self</label></div>
		`
	);
}
/**
	@param {HTMLElement} abilityElement
 */
function abilityControlFormChange(dropdown) {
	const idx = dropdown.name.charAt(7);
	const subidx = dropdown.name.charAt(9);
	const subsubidx = dropdown.name.charAt(11);
	const value = dropdown.value;
	const parameters = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}parameters`
	);
	parameters.innerHTML = "";
	if (value === "abilitycontrolstun" || value === "abilitycontrolturnskip") {
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}lastsfor" class="form-label">Lasts for</label>
				<div class="input-group"><input class="form-control" type="number" step="1" name="ability${idx}.${subidx}.${subsubidx}lastsfor" id="ability${idx}.${subidx}.${subsubidx}lastsfor" min="1" required /><span class="input-group-text">turn(s)</span></div>
			`
		);
	} else {
		parameters.insertAdjacentHTML(
			"beforeend",
			`
				<div class="seperatorinputs"></div>
				<label for="ability${idx}.${subidx}.${subsubidx}target" class="form-label">Apply to whole deck?</label>
				<div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" name="ability${idx}.${subidx}.${subsubidx}deck" id="ability${idx}.${subidx}.${subsubidx}deck" /></div>
			`
		);
	}
}

//-------------------------------------------------------------------
/**
	@param {HTMLElement} abilityElement
 */

function newAbilityGroup(abilityElement) {
	const idx = abilityElement.id.charAt(7);
	const subidx = abilityElement.id.charAt(9);
	const subsubidx = abilityElement.id.charAt(11);
	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);
	const parameters = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}parameters`
	);
	parameters.classList.add("abilitygroup");

	dynamicinputs.insertAdjacentHTML(
		"afterbegin",
		`
		<div class="abilityGroupControls addAbilityTop">
			<button class="addAbility addAbilityTo${idx}.${subidx}.${subsubidx} btn btn-primary" type="button" id="ability${idx}.${subidx}.${subsubidx}addabilitytop" onclick="abilityGroupAddAbility(this)">
				Add Ability
			</button>
		</div>
		`
	);
	if (subidx == 0)
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
			<div class="subability outline" id="ability${idx}.1.0">
				<h4>Ability #1</h4>

				<label for="ability${idx}.1.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.1.0type" id="ability${idx}.1.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.1.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.1.0parameters"></div></div>
			</div>

			<div class="subability outline" id="ability${idx}.2.0">
				<h4>Ability #2</h4>

				<label for="ability${idx}.2.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.2.0type" id="ability${idx}.2.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.2.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.2.0parameters"></div></div>
			</div>
		`
		);
	else
		parameters.insertAdjacentHTML(
			"afterbegin",
			`
			<div class="subsubability outline" id="ability${idx}.${subidx}.1">
				<h5>Ability #1</h5>

				<label for="ability${idx}.${subidx}.1type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.${subidx}.1type" id="ability${idx}.${subidx}.1type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.${subidx}.1dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.${subidx}.1parameters"></div></div>
			</div>

			<div class="subsubability outline" id="ability${idx}.${subidx}.2">
				<h5>Ability #2</h5>

				<label for="ability${idx}.${subidx}.2type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.${subidx}.2type" id="ability${idx}.${subidx}.2type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.${subidx}.2dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.${subidx}.2parameters"></div></div>
			</div>
		`
		);
	dynamicinputs.insertAdjacentHTML(
		"beforeend",
		`
		<div class="abilityGroupControls addAbilityBottom">
			<button class="addAbility addAbilityTo${idx}.${subidx}.${subsubidx} btn btn-primary" type="button" id="ability${idx}.${subidx}.${subsubidx}addabilitybottom" onclick="abilityGroupAddAbility(this)">
				Add Ability
			</button>
		</div>
		`
	);
}

/**
	@param {HTMLElement} button
 */
function abilityGroupAddAbility(button) {
	const idx = button.id.charAt(7);
	const subidx = button.id.charAt(9);
	const subsubidx = button.id.charAt(11);
	const dynamicinputs = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}dynamicinputs`
	);
	const parameters = document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}parameters`
	);

	if (subidx == 0) {
		let newAbilityIdx = findMissingID(parameters.children, 9, 1);
		parameters.insertAdjacentHTML(
			"beforeend",
			`
			<div class="subability outline" id="ability${idx}.${newAbilityIdx}.0">
				<h4>Ability #${parameters.children.length + 1}</h4>

				<label for="ability${idx}.${newAbilityIdx}.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.${newAbilityIdx}.0type" id="ability${idx}.${newAbilityIdx}.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.${newAbilityIdx}.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.${newAbilityIdx}.0parameters"></div></div>
				<div class="seperatorinputs"></div>
				<button class="deleteability btn btn-danger" type="button" onclick="abilityDelete(this)" id="ability${idx}.${newAbilityIdx}.0delete">Delete Ability</button>
			</div>
		`
		);
		document.getElementById(`ability${idx}.${newAbilityIdx}.0`).scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center",
		});
	} else {
		let newAbilityIdx = findMissingID(parameters.children, 11, 1);
		parameters.insertAdjacentHTML(
			"beforeend",
			`
			<div class="subsubability outline" id="ability${idx}.${subidx}.${newAbilityIdx}">
				<h5>Ability #${parameters.children.length + 1}</h5>

				<label for="ability${idx}.${subidx}.${newAbilityIdx}type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.${subidx}.${newAbilityIdx}type" id="ability${idx}.${subidx}.${newAbilityIdx}type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.${subidx}.${newAbilityIdx}dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.${subidx}.${newAbilityIdx}parameters"></div></div>
				<div class="seperatorinputs"></div>
				<button class="deleteability btn btn-danger" type="button" onclick="abilityDelete(this)" id="ability${idx}.${subidx}.${newAbilityIdx}delete">Delete Ability</button>
			</div>
		`
		);
		document
			.getElementById(`ability${idx}.${subidx}.${newAbilityIdx}`)
			.scrollIntoView({
				behavior: "smooth",
				block: "center",
				inline: "center",
			});
	}

	if (Array.from(parameters.children).length >= 5)
		Array.from(
			document.getElementsByClassName(
				`addAbilityTo${idx}.${subidx}.${subsubidx}`
			)
		).forEach((ele) => (ele.disabled = true));
}

//-------------------------------------------------------------------
/**
	@param {HTMLElement} abilityElement
 */

function newLuckAbility(abilityElement) {
	const idx = abilityElement.id.charAt(7);
	const dynamicinputs = document.getElementById(
		`ability${idx}.0.0dynamicinputs`
	);
	const parameters = document.getElementById(`ability${idx}.0.0parameters`);

	dynamicinputs.insertAdjacentHTML(
		"beforeend",
		`
			<div class="seperatorinputs"></div>
			<label for="ability${idx}.0.0chance" class="form-label">Chance of Each Outcome</label>
			<br/>
			<div class="chancecontainer">
				<input type="range" id="ability${idx}.0.0chance" name="ability${idx}.0.0chance" list="chancemarkers" min="1" max="99" value="50" class="chance" oninput="abilityLuckChanceChanged(this)">
				<div id="ability${idx}.0.0badchancetext" class="badchancetext">50%</div>
				<div id="ability${idx}.0.0goodchancetext" class="goodchancetext">50%</div>
			</div>
		`
	);

	parameters.classList.add("abilitygroup");
	parameters.insertAdjacentHTML(
		"afterbegin",
		`			
			<div class="subability outline bad" id="ability${idx}.1.0">
				<h4>Bad Ability</h4>

				<label for="ability${idx}.1.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.1.0type" id="ability${idx}.1.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
					<option value="abilitygroup">Ability Group</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.1.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.1.0parameters"></div></div>
			</div>
			<div class="subability outline good" id="ability${idx}.2.0">
				<h4>Good Ability</h4>

				<label for="ability${idx}.2.0type" class="form-label">Type</label>
				<select class="form-select" name="ability${idx}.2.0type" id="ability${idx}.2.0type" onchange="abilityTypeChange(this)" required>
					<option hidden disabled selected value>-- Select an option --</option>
					<option value="abilityoffense">Damage</option>
					<option value="abilitysupport">Support</option>
					<option value="abilitycontrol">Control</option>
					<option value="abilitygroup">Ability Group</option>
				</select>
				
				<div class="seperatorinputs hideunlesssmthselected"></div>
				<div id="ability${idx}.2.0dynamicinputs" class="outline hideunlesssmthselected"><div id="ability${idx}.2.0parameters"></div></div>
			</div>
		`
	);
}
/**
	@param {HTMLElement} range
 */
function abilityLuckChanceChanged(range) {
	const idx = range.id.charAt(7);
	const subidx = range.id.charAt(9);
	const subsubidx = range.id.charAt(11);

	const goodChance = 100 - range.value + "%";
	const badChance = range.value + "%";

	document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}goodchancetext`
	).innerHTML = goodChance;

	document.getElementById(
		`ability${idx}.${subidx}.${subsubidx}badchancetext`
	).innerHTML = badChance;
}

/**
	@param {HTMLElement} button
 */
function abilityDelete(button) {
	const idx = button.id.charAt(7);
	const subidx = button.id.charAt(9);
	const subsubidx = button.id.charAt(11);
	if (subidx != 0) {
		if (subsubidx != 0) {
			Array.from(
				document.getElementsByClassName(`addAbilityTo${idx}.${subidx}.0`)
			).forEach((ele) => {
				ele.disabled = false;
			});

			const deletionheader = button.parentElement
				.getElementsByTagName("h5")
				.item(0);
			const deletionheaderId = Number.parseInt(
				deletionheader.innerHTML.charAt(9)
			);
			Array.from(
				document.getElementById(`ability${idx}.${subidx}.0parameters`).children
			).forEach((ele) => {
				const header = ele.getElementsByTagName("h5").item(0);
				const headerId = Number.parseInt(header.innerHTML.charAt(9));
				if (headerId > deletionheaderId)
					header.innerHTML = `Ability #${headerId - 1}`;
			});
		} else {
			Array.from(
				document.getElementsByClassName(`addAbilityTo${idx}.0.0`)
			).forEach((ele) => {
				ele.disabled = false;
			});

			const deletionheader = button.parentElement
				.getElementsByTagName("h4")
				.item(0);
			const deletionheaderId = Number.parseInt(
				deletionheader.innerHTML.charAt(9)
			);
			Array.from(
				document.getElementById(`ability${idx}.0.0parameters`).children
			).forEach((ele) => {
				const header = ele.getElementsByTagName("h4").item(0);
				const headerId = Number.parseInt(header.innerHTML.charAt(9));
				if (headerId > deletionheaderId)
					header.innerHTML = `Ability #${headerId - 1}`;
			});
		}
	} else {
		abilityControlButtonsTop.children.item(1).disabled = false;
		abilityControlButtonsBottom.children.item(1).disabled = false;

		const deletionheader = button.parentElement
			.getElementsByTagName("h3")
			.item(0);
		const deletionheaderId = Number.parseInt(
			deletionheader.innerHTML.charAt(9)
		);
		Array.from(abilities.children).forEach((ele) => {
			const header = ele.getElementsByTagName("h3").item(0);
			let headerId = Number.parseInt(header.innerHTML.charAt(9));
			if (headerId == 1) {
				if (Number.parseInt(header.innerHTML.charAt(10)) == 0) headerId = 10;
			}
			if (headerId >= deletionheaderId)
				header.innerHTML = `Ability #${headerId - 1}`;
		});
	}

	button.parentElement.remove();
}

/**
 *
 * @param {HTMLElement} abilities
 * @param {number} charNum
 * @param {number} minimum
 */
function findMissingID(abilities, charNum, minimum) {
	const ids = Array.from(abilities, (child) =>
		parseInt(child.id.charAt(charNum))
	);
	const sortedIDs = ids.sort((a, b) => a - b);
	for (let i = 0; i < sortedIDs.length; i++)
		if (sortedIDs[i] !== i + minimum) return i + minimum;
	return sortedIDs.length + minimum;
}
