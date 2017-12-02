import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Survey from './Survey'

class SurveyPage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>Ankieta</h3>
                <Row>
                   <Col lg={6} md={8} sm={12}>
                      <Survey></Survey>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default SurveyPage;

