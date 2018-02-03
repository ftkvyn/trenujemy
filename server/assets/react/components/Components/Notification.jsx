import React from 'react';
import { Row, Col, FormGroup } from 'react-bootstrap';


const Notification = (props) => {	
  if(!props.count){
    return null;
  }
  return <div className="pull-right label label-danger menu-notification">{props.count}</div>
}

export default Notification;