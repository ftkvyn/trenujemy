import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Advice from './Advice'

class AdvicePage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>Zalecenia trenera</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Advice trainerId={this.props.match.params.trainerId}></Advice>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default withRouter(AdvicePage);

