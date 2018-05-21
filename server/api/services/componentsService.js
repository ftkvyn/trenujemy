const fs = require('fs');
const os = require("os");

const inputFile='./data/components.csv';
let componentsList = [];

(function loadComponents(){
	const text = fs.readFileSync(inputFile,'utf8');
	const lines = text.split(os.EOL);


	//first line id header
	for(let i = 1; i < lines.length; i++){
		let component = {};		
		let dataLine = lines[i].split('\t');		
		component.name = dataLine[0];
		component.nameLower = component.name.toLowerCase();
		component.num = i;
		component.calories = parseFloat(dataLine[1]);
		component.fat = parseFloat(dataLine[2]);
		component.carbohydrate = parseFloat(dataLine[3]);
		component.protein = parseFloat(dataLine[4]);

		componentsList.push(component);
	}
})();



exports.getComponents = function() {
	return componentsList;
}