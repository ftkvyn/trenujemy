import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';

class AddComponentSecondStep extends React.Component {
    
    render() {  
        return (
            <div className='dish-popup'>
                <h3>Dodaj składnik</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Well bsSize="large" style={{'textAlign':'center'}}>
                          <h1><em className="fa fa-address-book-o"></em></h1>
                          <p>Tutaj uzupełniasz ilość składniku.</p>
                      </Well>
                   </Col>
                </Row>
            </div>
        );
    }

}

export default AddComponentSecondStep;
