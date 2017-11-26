import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUser, saveUser } from '../Common/userDataService';

let hideAlertSuccess = null;
let hideAlertError = null;

function saveUserFn(newUser){
    saveUser(newUser)
    .then(function(){
        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
    })
    .catch(function(){
        $('.saveSuccess').hide();
        $('.saveError').show();
        clearTimeout(hideAlertError);
        hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
    });
}

class Profile extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            user: {}
        };
        let me = this;
        loadUser()
        .then(function(userData) {              
            me.setState({user: userData});
            $('#datetimepicker').datetimepicker({
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-crosshairs',
                    clear: 'fa fa-trash'
              },
              format:'DD.MM.YYYY',
              keepOpen: false,
              defaultDate: userData.birthday
            });
            $("#datetimepicker").on("dp.change", function (e) {
                let newDate = e.date.toDate().toISOString();
                let newUser = me.state.user;
                newUser.birthday = newDate
                me.setState({user: newUser});

                debounce(() => saveUserFn(newUser), 1000)();
            });
            if(userData.birthday){;
                $('#datetimepicker').data("DateTimePicker").date(userData.birthday);
            }
        });
    };

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newUser = this.state.user;
        newUser[fieldName] = fieldVal
        this.setState({user: newUser});

        debounce(() => saveUserFn(newUser), 1000)();        
    }

    render() {  
        var invoiceForm = "";
        if(this.state.user.role == 'trainer'){
            invoiceForm = <FormGroup>
                <label className="col-lg-2 control-label">Dane do faktury: </label>
                <Col lg={ 10 }>
                    <textarea 
                    className="form-control" 
                    name='invoiceInfo'
                    value={this.state.user.invoiceInfo || ''}
                    onChange={this.handleChange.bind(this)}></textarea>
                </Col>
            </FormGroup>     
        }      
        return (
            <ContentWrapper>
                <h3>Twoje dane</h3>
                <Row>
                   <Col lg={6} md={8} sm={12}>
                      <Panel>
                            <form className="form-horizontal">                                
                                <FormGroup>
                                    <label className="col-lg-2 control-label">Imię i nazwisko:</label>
                                    <Col lg={ 10 }>
                                        <FormControl type="text" placeholder="Imię i nazwisko" 
                                        className="form-control" 
                                        name='name'
                                        value={this.state.user.name || ''}
                                        onChange={this.handleChange.bind(this)}/>
                                    </Col>
                                </FormGroup> 
                                 <FormGroup>
                                    <label className="col-lg-2 control-label">Data urodzenia:</label>
                                    <Col lg={ 10 }>
                                        <div id="datetimepicker" className="input-group date">
                                            <input type="text" className="form-control" name='birthday'/>
                                            <span className="input-group-addon">
                                            <span className="fa fa-calendar"></span>
                                            </span>
                                        </div>
                                    </Col>
                                </FormGroup> 
                                 <FormGroup>
                                    <label className="col-lg-2 control-label">Numer telefonu:</label>
                                    <Col lg={ 10 }>
                                        <FormControl type="text" placeholder="Numer telefonu" 
                                        className="form-control" 
                                        name='phone'
                                        value={this.state.user.phone || ''}
                                        onChange={this.handleChange.bind(this)}/>
                                    </Col>
                                </FormGroup>   
                                <FormGroup>
                                    <label className="col-lg-2 control-label">Adres email:</label>
                                    <Col lg={ 10 }>
                                        <FormControl type="email" readOnly='true' placeholder="Adres email" 
                                        className="form-control" 
                                        value={this.state.user.login || ''}/>
                                    </Col>
                                </FormGroup>       
                                {invoiceForm} 
                                <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                                    Dane zapisane poprawnie.
                                </div>  
                                <div role="alert" className="alert alert-success saveError" style={{display:'none'}}>
                                    Nie udało się zapisać dane.
                                </div>                                                                                
                            </form>
                        </Panel>
                   </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default Profile;

