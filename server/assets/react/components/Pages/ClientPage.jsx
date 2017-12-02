import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Profile from './Profile'


class ClientPage extends React.Component {
    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath == paths[i]){
                return true;
            }
        }
        return false;
    }
    
    render() {  
        const currentKey = location.pathname.split('/')[1] || '/';
        const timeout = { enter: 500, exit: 500 };
        const animationName = 'rag-fadeIn'
        return (
            <ContentWrapper>
                <h3>
                  <Link to={"/clients/" + this.props.match.params.id}>
                    <button type="button" 
            className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id) ? 'btn-primary' : 'btn-default') }>
                      Dane
                    </button>  
                  </Link>
                  <Link to={"/clients/" + this.props.match.params.id + "/survey"}>
                    <button type="button" 
            className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id + '/survey') ? 'btn-primary' : 'btn-default') }>
                      Ankieta
                    </button>
                  </Link>
                  
                </h3>
                <Row>
                   <Col lg={6} md={8} sm={12}>
                      <Route exact path="/clients/:id" component={Profile}/>
                      <Route path="/clients/:id/survey" render={() => (
                        <h3>Please select a topic.</h3>
                      )}/>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default ClientPage;

