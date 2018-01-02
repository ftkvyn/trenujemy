import React from 'react';
import { Row, Col } from 'react-bootstrap';

function getProgressBarStyle(val){
	  let result = {};
	  if(val > 100){
	    result.backgroundColor = "#f05050";
	  }else{
	    result.backgroundColor = "#27c24c";
	  }
	  result.width = ((val / 150) * 100);
	  if(result.width > 100){
	  	result.width = 100;
	  }
	  result.width += '%';
	  return result;
}

const FoodInfoRow = (props) => {
	if(props.hide){
		return null;
	}
	const today = props.today || 0;
	const advise = props.advise || 0;
	let percent = 0;	
	if(props.advise > 0){
		percent = Math.round((today / advise)*100);
	}
	return (
  <Row>
    <Col lg={2} md={2} sm={3} xs={4} className="text-right"><label>{props.title + ":"}</label></Col>
    <Col lg={1} md={1} sm={2} xs={2}>{Math.round(today)}</Col>
    <Col lg={7} md={7} sm={3} xs={2}>
      <div className="progress-bar-container">
        <div className="progress-bar-custom" style={getProgressBarStyle(percent)}></div>
      </div>
    </Col>
    <Col lg={1} md={1} sm={2} xs={2}>{Math.round(advise)}</Col>
    <Col lg={1} md={1} sm={2} xs={2}>{percent + "%"}</Col>
  </Row>
)}

export default FoodInfoRow;