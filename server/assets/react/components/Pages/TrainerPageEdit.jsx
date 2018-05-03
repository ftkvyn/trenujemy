import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadTrainerInfo, saveTrainerInfo, adminActivate } from '../Common/trainerInfoService';
import { loadUser } from '../Common/userDataService';

class TrainerPageEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            trainerInfo: {},
            userInfo: {}
        };
        this.state = initialState;        
    };

    componentDidMount(){
        loadTrainerInfo()
            .then((data) => this.setState({trainerInfo: data}));
        loadUser()
            .then((data) => this.setState({userInfo: data.user}));         
    }

    handleChange(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.checked;        
        let newInfo = this.state.trainerInfo;
        newInfo[fieldName] = fieldVal;
        this.setState({trainerInfo: newInfo});
        if(fieldName == 'isApprovedByAdmin'){
            adminActivate(newInfo);
        }else{
            saveTrainerInfo(newInfo);
        }
    }

    render() {  
        if(!this.state.trainerInfo.id || !this.state.userInfo.id){
            return null;
        }
        let statusInfo = <p>Status: <span className='inactive-page'>nieaktywna</span></p>
        if(this.state.trainerInfo.isActivatedByTrainer){
            if(!this.state.trainerInfo.isApprovedByAdmin){
                statusInfo = <p>Status: <span className='wait-for-admin-page'>nieaktywna</span><br/>Strona oczekuje na aktywację przez administartora serwisu</p>
            }
            else{
                statusInfo = <p>Status: <span className='active-page'>aktywna</span></p>
            }    
        }
        let adminActivateCheckbox = '';
        let readonlyProps = {readOnly: true, disabled: 'disabled'};
        if(this.state.userInfo._isAdmin){
            readonlyProps = {};
        }
        return (
        	<ContentWrapper>
                <h3>Panel klienta</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                   		<Well bsSize="large" style={{'textAlign':'center'}}>
                          	<h1>Moja strona</h1>
                            {statusInfo}
                            <FormGroup>
                                <label className="checkbox-inline c-checkbox">
                                    <input type="checkbox" name="isApprovedByAdmin" 
                                    value="1" {...readonlyProps}
                                    className='needsclick'
                                    checked={this.state.trainerInfo.isApprovedByAdmin} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em> Strona aktywowana przez administatora
                                </label>
                            </FormGroup>
                            <FormGroup>
                                <label className="checkbox-inline c-checkbox">
                                    <input type="checkbox" name="isActivatedByTrainer" 
                                    value="1"
                                    className='needsclick'
                                    checked={this.state.trainerInfo.isActivatedByTrainer} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-check"></em> Strona aktywna
                                </label>
                            </FormGroup>
                            <p><a href={'/' + this.state.trainerInfo.friendlyId } target="_blank">Podgląd strony</a></p>
                      	</Well>
                        <iframe src={'/editTrainerPage/' + this.state.trainerInfo.friendlyId } style={{width: "100%", minHeight: "1000px", border:"none"}}></iframe>
	            	</Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainerPageEdit;

