import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';

class AddComponentFirstStep extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            rootPath: this.props.location.pathname
        };
        this.state = initialState; 
    };


    componentWillMount(){
      document.body.className += ' ' + 'with-popup';      
    }

    componentWillUnmount(){
      document.body.className = document.body.className.replace("with-popup","");
    }

    render() {  
        return (
            <div className='dish-popup'>
                <h3>Dodaj składnik</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Well bsSize="large" style={{'textAlign':'center'}}>
                          <h1><em className="fa fa-address-book-o"></em></h1>
                          <p>Tutaj wybierz składnik.</p>
                          <Link to={this.state.rootPath + "/10/quantity"}>
                              <div className='btn btn-outline btn-primary'>Next</div>
                          </Link>
                      </Well>
                   </Col>
                </Row>
            </div>
        );
    }

}

export default withRouter(AddComponentFirstStep);
