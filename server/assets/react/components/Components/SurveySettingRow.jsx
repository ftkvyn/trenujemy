import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap';


const SurveySettingRow = (props) => {	
	return (
  <FormGroup> 
  	<Row>
      <Col lg={ 4 } md={4} sm={6} xs={8}>
        <label className="pointer control-label pull-right" 
        htmlFor={'field_' + props.name}
        style={{ paddingTop: '10px'}}>
            {props.label}
        </label>
      </Col>
      <Col lg={ 8 } md={8} sm={6} xs={4}>
          <div className="checkbox c-checkbox">
            <label className="pointer control-label">
              <input type="checkbox" name={props.name}
              id={'field_' + props.name}
              checked={props.items.some( (item) => item == props.name )} 
              onChange={props.onChange} />
              <em className="fa fa-check"></em>
            </label>
          </div>
      </Col>
    </Row>
  </FormGroup>
)}

export default SurveySettingRow;