import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadNotifications, saveNotifications  } from '../Common/notificationsService';

class WelcomeScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(props);
        let initialState = {
          visible: true,
          dontRemind: false,
          notifications: {},
          role: props.role
        };
        this.state = initialState; 
    };

    componentDidMount(){        
        loadNotifications()
            .then((data) => this.setState({notifications: data}));
    }

    componentWillMount(){
      document.body.className += ' ' + 'with-popup';      
    }

    componentWillUnmount(){
      document.body.className = document.body.className.replace("with-popup","");
    }

    handleNotificationsCheckbox(event){
        let newValue = !this.state.dontRemind;
        this.setState({dontRemind: newValue});
        let model = Object.assign({}, this.state.notifications);
        model.helloMessage = newValue;
        saveNotifications(model);
    }

    close(event){
      document.body.className = document.body.className.replace("with-popup","");
      this.setState({visible: false});
    }

    render() {  
        if(!this.state.visible){
          return null;
        }
        let headerText = '';
        if(this.state.role == 'trainer'){
          headerText = "Witaj w panelu trenera,";
        }else{
          headerText = "Witaj w panelu klienta,";
        }
        return (
            <div className='welcome-popup'>
                <h2 className='text-center'>
                    <span>{headerText}</span> <br/>oto co teraz zrobisz
                </h2>
                <Well bsSize="large" style={{'textAlign':'center'}}>
                  <Row>
                     <Col lg={4} md={4} sm={4} xs={12}>
                        
                            <h3>Krok 1 - co masz zrobić</h3>
                            <p>Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku</p>
                        
                     </Col>
                     <Col lg={4} md={4} sm={4} xs={12}>
                            <h3>Krok 2 - co masz zrobić</h3>
                            <p>Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku</p>
                     </Col>
                      <Col lg={4} md={4} sm={4} xs={12}>
                            <h3>Krok 3 - co masz zrobić</h3>
                            <p>Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku, Tekst  o tym co klient ma zrobić w ramach tego kroku</p>
                     </Col>
                  </Row>
                  <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                          <div onClick={this.close.bind(this)} className="btn btn-primary mr pull-right">OK</div>
                      </Col>
                      <Col lg={12} md={12} sm={12} xs={12}>
                          <div className='text-right'>
                              <label htmlFor='dontRemind' className='pointer' style={{margin: '9px 10px 0 0'}}>Nie przypominaj mi o tym następnym razem</label>
                              <div className="checkbox c-checkbox pull-right">
                                  <label>
                                      <input type="checkbox" name="dontRemind" id='dontRemind'
                                      checked={this.state.dontRemind} 
                                      onChange={this.handleNotificationsCheckbox.bind(this)} />
                                      <em className="fa fa-check"></em>
                                  </label>
                              </div>
                          </div>
                      </Col>
                  </Row>
                </Well>
            </div>
        );
    }

}

export default withRouter(WelcomeScreen);
