import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import Diary from './Diary'

class DiaryPage extends React.Component {
    
    render() {  
        return (
            <ContentWrapper>
                <h3>Dziennik aktywności</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Well bsSize="large" style={{'textAlign':'center'}}>
                          <h1><em className="fa fa-address-book-o"></em></h1>
                          <p>Tutaj uzupełniasz codziennie szczegóły swojej diety oraz treningu.</p>
                      </Well>
                      <Diary></Diary>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default DiaryPage;

