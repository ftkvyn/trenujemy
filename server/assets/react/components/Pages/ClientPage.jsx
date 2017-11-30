import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Profile from './Profile'

class ClientPage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>
                  <button type="button" className="mb-sm mr-sm btn btn-primary btn-outline">Dane</button>
                  <button type="button" className="mb-sm mr-sm btn btn-default btn-outline">Ankieta</button>
                </h3>
                <Row>
                   <Col lg={6} md={8} sm={12}>
                      <Profile userId={this.props.match.params.id} ></Profile>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default ClientPage;

