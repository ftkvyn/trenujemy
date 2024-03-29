import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import Profile from './Profile'

class ProfilePage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>Moje dane</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Profile></Profile>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default ProfilePage;

