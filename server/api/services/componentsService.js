const fs = require('fs');
const os = require("os");

const inputFile='./data/components.csv';
let componentsList = [];

(function loadComponents(){
	const text = fs.readFileSync(inputFile,'utf8');
	const lines = text.split(os.EOL);

	//first two lines are headers
	for(let i = 2; i < lines.length; i++){
		let component = {};
		let dataLine = lines[i].split('\t');
		component.name = dataLine[0];
		component.num = i;
		component.calories = parseFloat(dataLine[1]);
		component.protein = parseFloat(dataLine[2]);
		component.fat = parseFloat(dataLine[3]);
		component.carbohydrate = parseFloat(dataLine[4]);
		component.sodium = parseFloat(dataLine[5]);
		component.potassium = parseFloat(dataLine[6]);
		component.calcium = parseFloat(dataLine[7]);
		component.iron = parseFloat(dataLine[8]);
		component.vitaminC = parseFloat(dataLine[9]);
		component.vitaminA = parseFloat(dataLine[10]);
		component.fiber = parseFloat(dataLine[11]);

		componentsList.push(component);
	}
})();



exports.getComponents = function() {
	return componentsList;
}