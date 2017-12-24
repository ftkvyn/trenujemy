import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';

import Profile from './Profile'
import Survey from './Survey'
import Advice from './Advice'
import Diary from './Diary'

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

    routeActiveStart(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath.indexOf(paths[i]) != -1){
                return true;
            }
        }
        return false;
    }
    
    render() {  
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
                  <Link to={"/clients/" + this.props.match.params.id + "/advice"}>
                    <button type="button" 
            className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id + '/advice') ? 'btn-primary' : 'btn-default') }>
                      Zalecenia
                    </button>
                  </Link>
                  <Link to={"/clients/" + this.props.match.params.id + "/diary"}>
                    <button type="button" 
            className={"mb-sm mr-sm btn btn-outline " + (this.routeActiveStart('/clients/' + this.props.match.params.id + '/diary') ? 'btn-primary' : 'btn-default') }>
                      Dziennik
                    </button>
                  </Link>                  
                </h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                    <Route exact path="/clients/:id" component={Profile}/>
                    <Route path="/clients/:id/survey" component={Survey}/>
                    <Route path="/clients/:id/advice" component={Advice}/>
                    <Route path="/clients/:id/diary/:day?" component={Diary}/>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default ClientPage;

