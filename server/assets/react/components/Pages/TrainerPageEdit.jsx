import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

class TrainerPageEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
        };
        this.state = initialState;        
    };

    componentDidMount(){
        
    }

    render() {  
        
        return (
        	<ContentWrapper>
                <h3>Panel klienta</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1>Moja strona</h1>
                            <p>Status: nieaktywna</p>
                          	<p>Strona oczekuje na aktywację przez administartora serwisu</p>
                            <p><a href="/trainer" target="_blank">Podgląd strony</a></p>
                      	</Well>
                        <iframe src="/trainer" style={{width: "100%", minHeight: "1000px", border:"none"}}></iframe>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainerPageEdit;

