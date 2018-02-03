import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadUser } from '../Common/userDataService';

import Profile from './Profile'
import Survey from './Survey'
import Advice from './Advice'
import Diary from './Diary'
import Trainings from './Trainings'

class ClientPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            userData:{},
            userId: this.props.match.params.id
        };
        this.state = initialState;        
    };

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

    componentWillReceiveProps(nextProps) {
        var nextId = undefined;
        if(nextProps.match && nextProps.match.params){
            nextId = nextProps.match.params.id;
        }
        if(this.state.userId === nextId){
            return;
        }
        this.setState({userId: nextId});
        loadUser(nextId)
            .then((userData) => {              
                this.setState({userData: userData});
            });
    }

    componentDidMount(){
      loadUser(this.state.userId)
          .then((userData) => {              
              this.setState({userData: userData});
          });
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
        let surveyLinkItem = '';
        let adviceLinkItem = '';
        let diaryLinkItem = '';
        let trainingsLinkItem = '';
        if(this.state.userData.feedPlans){
          if(this.state.userData.feedPlans.some( item => item.plan && item.plan.isWithConsulting)){
            diaryLinkItem = <Link to={"/clients/" + this.props.match.params.id + "/diary"}>
              <button type="button" 
      className={"mb-sm mr-sm btn btn-outline " + (this.routeActiveStart('/clients/' + this.props.match.params.id + '/diary') ? 'btn-primary' : 'btn-default') }>
                Dziennik
              </button>
            </Link>  
          }
        }
        if( (this.state.userData.feedPlans && this.state.userData.feedPlans.length) || 
          (this.state.userData.trainPlans && this.state.userData.trainPlans.length)){
          surveyLinkItem = <Link to={"/clients/" + this.props.match.params.id + "/survey"}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id + '/survey') ? 'btn-primary' : 'btn-default') }>
                  Ankieta
                </button>
              </Link>
          adviceLinkItem = <Link to={"/clients/" + this.props.match.params.id + "/advice"}>
            <button type="button" 
    className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id + '/advice') ? 'btn-primary' : 'btn-default') }>
              Zalecenia
            </button>
          </Link>
        }
        if(this.state.userData.trainPlans && this.state.userData.trainPlans.length){
          trainingsLinkItem = <Link to={"/clients/" + this.props.match.params.id + "/trainings"}>
            <button type="button" 
    className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id + '/trainings') ? 'btn-primary' : 'btn-default') }>
              Treningi
            </button>
          </Link>
        }

        return (
            <ContentWrapper>
                <h3>
                  <Link to={"/clients/" + this.props.match.params.id}>
                    <button type="button" 
            className={"mb-sm mr-sm btn btn-outline " + (this.routeActive('/clients/' + this.props.match.params.id) ? 'btn-primary' : 'btn-default') }>
                      Dane
                    </button>  
                  </Link>
                  {surveyLinkItem}                  
                  {adviceLinkItem}
                  {diaryLinkItem}    
                  {trainingsLinkItem}            
                </h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                    <Route exact path="/clients/:id" component={Profile}/>
                    <Route path="/clients/:id/survey" component={Survey}/>
                    <Route path="/clients/:id/advice" component={Advice}/>
                    <Route path="/clients/:id/diary/:day?" component={Diary}/>
                    <Route path="/clients/:id/trainings" component={Trainings}/>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default withRouter(ClientPage);

