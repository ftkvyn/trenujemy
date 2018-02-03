import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Trainings from './Trainings'

class TrainingsPage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>Twoje treningi</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Trainings></Trainings>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainingsPage;

