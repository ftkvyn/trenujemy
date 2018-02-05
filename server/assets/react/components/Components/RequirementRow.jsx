import React from 'react';
import { Row, Col } from 'react-bootstrap';

const names = {
	"provideWeight":"aktualizował wagę",
	"provideSizes":"aktualizował wymiary",
	"providePhoto":"ładował zdjęcie",
};

const periods = {
	'never':null, 
	'monthly':'co miesiąc', 
	'each_second_week':'co dwa tygodnie', 
	'weekly':'co tydzień', 
	'each_third_day':'co trzeci dzień', 
	'each_second_day':'co drugi dzień', 
	'each_day':'codziennie', 
}

const RequirementRow = (props) => {
	if(!props.name || !props.period || props.period == 'never'){
		return null;
	}
	let text = `Twój trener zaleca, abyś ${names[props.name]} ${periods[props.period]}.`
	return (
	  <div className="requirement-row">
	    	{text}
	  </div>
)}

export default RequirementRow;