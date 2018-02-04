import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import Survey from './Survey'
import { loadNotifications, saveNotifications, updateNotifications } from '../Common/notificationsService';

class SurveyPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            notifications: {},
        };
        this.state = initialState;        
    };

    componentDidMount(){
        loadNotifications()
            .then((data) => this.setState({notifications: data}));
    }

    componentWillUnmount(){
        if(this.state.notifications.id){
            saveNotifications({id: this.state.notifications.id, updateSurvey: false});
        }
        updateNotifications({survey: 0});
    }

    render() {  
        return (
            <ContentWrapper>
                <h3>Ankieta</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Well bsSize="large" style={{'textAlign':'center'}}>
                          <h1><em className="fa fa-edit"></em></h1>
                          <p>Poprawne wypełnienie ankiety pozwoli trenerowi lepiej dostosować trening i zalecenia żywieniowe do Twoich indywidualnych potrzeb</p>
                      </Well>
                      <Survey></Survey>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default SurveyPage;

