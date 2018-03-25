import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUser, saveUser, loadRequirements, saveRequirements, loadSurvey, loadPurchases } from '../Common/userDataService';
import { saveImage, getFileLink } from '../Common/filesService';
import { loadClients } from '../Common/clientsService';

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

function saveRequirementsFn(data){
    saveRequirements(data)
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

function loadClientData(id){
    loadUser(id)
    .then((userData) => {
        setUser.call(this, userData);
    });

    this.setState({requirements: {}});
    this.setState({userData: {}});

    loadRequirements(id)
    .then((data) => {
        this.setState({requirements: data});
    });

    loadSurvey(id)
    .then((data) => {
        this.setState({userData: data});
    });
}

function destroyDp(){
    if($('#datetimepicker').data("DateTimePicker")) {
        $('#datetimepicker').data("DateTimePicker").destroy();
        $('#datetimepicker input').val(null);
        $('#datetimepicker').off('dp.change');
        $('#datetimepicker *').off('dp.change');
    }
}

function setUser(userData){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    destroyDp();
    let user = userData.user;
    this.setState({user: user, feedPlans: userData.feedPlans, trainPlans: userData.trainPlans});
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
      defaultDate: user.birthday
    });
    $("#datetimepicker").on("dp.change",  (e) => {
        let newDate = e.date.toDate().toISOString();
        let newUser = this.state.user;
        newUser.birthday = newDate
        this.setState({user: newUser});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveUserFn(newUser), 1000);
        saveHandler();
    });    
}

let saveHandler = null;

class Profile extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            user:{},
            userData:{},
            requirements:{},
            feedPlans:[],
            trainPlans:[]
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
        }
        this.state = initialState;        
    };

    componentWillReceiveProps(nextProps) {
        var nextId = undefined;
        if(nextProps.match && nextProps.match.params){
            nextId = nextProps.match.params.id;
        }
        if(this.state.userId === nextId){
            return;
        }
        this.setState({userId: nextId});
        if(!nextId){
            loadUser()
            .then((data) => setUser.call(this, data));
        }else{
            loadClientData.call(this, nextId);
        }
    }

    downloadFile(){
        if(!this.state.userData.medicalReporKey){
            return;
        }
        getFileLink(this.state.userData.id)
        .then((data) => {
            var link = document.createElement("a");
            link.download = this.state.userData.medicalReportName;
            link.href = data.url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(function(err){
            alert('Nie udało się pobrać plik');
        });
    }

    componentDidMount(){
        if(!this.state.userId){
            loadUser()
            .then((data) => setUser.call(this, data));
        }else{
            loadClientData.call(this, this.state.userId);
        }
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newUser = this.state.user;
        newUser[fieldName] = fieldVal
        this.setState({user: newUser});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveUserFn(newUser), 1000);        
        saveHandler();
    }

    handleChangeRequirements(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        if(fieldName.indexOf('boolSelect:') > -1){
            fieldName = fieldName.replace('boolSelect:','');
            if(fieldVal == 'true'){
                fieldVal = true;
            }else{
                fieldVal = false;
            }
        }else if(fieldName.indexOf('bool:') > -1){
            fieldName = fieldName.replace('bool:','');
            fieldVal = event.target.checked;
        }
        let newData = this.state.requirements;
        newData[fieldName] = fieldVal
        this.setState({requirements: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveRequirementsFn(newData), 1000);        
        saveHandler();
    }

    imageClick(event){
        if(this.state.userId){
            return;
        }
        $('#profilePicInput').click();
    }

    uploadImage(){
        var formData = new FormData();
        var fileData = $('#profilePicInput')[0].files[0];
        formData.append('file', fileData);
        saveImage(formData)
        .then((data) => {
            let newUser = this.state.user;
            newUser.profilePic = data.url;
            this.setState({user: newUser});
            if(saveHandler){
                saveHandler.clear();
            }
            saveHandler = debounce(() => saveUserFn(newUser), 100);        
            saveHandler();
        })
        .catch(function(err){
            $('.saveError').show();
            clearTimeout(hideAlertError);
            hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
        });
    }

    render() {  
        let invoiceForm = "";
        let requirementsForm = "";
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
        let readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true};
            if(this.state.requirements.user && this.state.userData.id){
                let downloadForm = "";
                if(this.state.userData.medicalReportName){
                    downloadForm = <FormGroup>
                        <label className="col-lg-2 control-label">Badania lekarskie:</label>
                        <Col lg={ 10 }>
                            <label className='mr' style={this.state.userData.medicalReportName ? {} : {'display':'none'}}>{this.state.userData.medicalReportName}</label>
                            <a onClick={this.downloadFile.bind(this)} style={this.state.userData.medicalReporKey ? {'cursor':'pointer'} : {'display':'none'}}>Pobierz</a>
                        </Col>
                    </FormGroup> 
                }
                if( (this.state.feedPlans && this.state.feedPlans.length) ||
                    (this.state.trainPlans && this.state.trainPlans.length)){
                    requirementsForm = <div>
                        <hr/>
                        <FormGroup>
                            <label className="col-lg-2 control-label">Wysyłaj ciekawostki i wskazówki:</label>
                            <Col lg={ 10 }>
                                <FormControl componentClass="select" name="sendTips" 
                                value={this.state.requirements.sendTips}
                                onChange={this.handleChangeRequirements.bind(this)}
                                className="form-control">
                                    <option value='twice_a_day'>Dwa razy dziennie</option>
                                    <option value='each_day'>Raz dziennie</option>
                                    <option value='each_second_day'>Co drugi dzień</option>
                                    <option value='each_third_day'>Co trzeci dzień</option>
                                    <option value='weekly'>Raz w tygodniu</option>
                                    <option value='never'>Nie wysyłaj</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                        {downloadForm}
                    </div>  
                }
            }
        }
        let profilePic = this.state.user.profilePic || '/images/no_image_user.png';
        let picForm = "";
        if(!this.state.userId){
            picForm = <form id='profilePicForm' style={{display:'none'}}>
                <input type='file' name='file' id='profilePicInput' accept="image/x-png,image/gif,image/jpeg" onChange={this.uploadImage.bind(this)}/>
            </form>
        }


        return (
              <Panel>
                    <form className="form-horizontal">     
                        <FormGroup>
                            <label className="col-lg-2 control-label">Zdjęcie profilowe:</label>
                            <Col lg={ 10 }>
                                <img src={profilePic} className='profile-pic' onClick={this.imageClick.bind(this)}/>
                            </Col>
                        </FormGroup> 
                        <FormGroup>
                            <label className="col-lg-2 control-label">Imię i nazwisko:</label>
                            <Col lg={ 10 }>
                                <FormControl type="text" placeholder="Imię i nazwisko" 
                                className="form-control" {...readonlyProps}
                                name='name'
                                value={this.state.user.name || ''}
                                onChange={this.handleChange.bind(this)}/>
                            </Col>
                        </FormGroup> 
                        <FormGroup>
                            <label className="col-lg-2 control-label">Data urodzenia:</label>
                            <Col lg={ 10 }>
                                <div id="datetimepicker" className="input-group date">
                                    <input type="text" className="form-control" name='birthday' {...readonlyProps}/>
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
                                className="form-control" {...readonlyProps}
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
                        {requirementsForm}
                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                            Dane zapisane poprawnie.
                        </div>  
                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                            Nie udało się zapisać dane.
                        </div>
                    </form>
                    {picForm}
                </Panel>
        );
    }

}

export default Profile;

