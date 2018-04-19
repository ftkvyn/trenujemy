import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUser, saveUser, loadSurvey, loadPurchases, updateEmail } from '../Common/userDataService';
import { saveImage, getFileLink } from '../Common/filesService';
import { loadClients } from '../Common/clientsService';
import WelcomeScreen from '../Components/WelcomeScreen';
import { loadNotifications } from '../Common/notificationsService';
import { saveTrainerInfo, loadTrainerInfo, saveTrainerRoute } from '../Common/trainerInfoService';



let hideAlertSuccess = null;
let hideAlertError = null;
let saveHandler = null;
let saveTrainerHandler = null;
let saveRouteHandler = null;

function saveUserFn(newUser){
    let nameChanged = newUser.nameChanged;
    delete newUser.nameChanged;
    saveUser(newUser)
    .then(function(){
        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);        
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
        if(nameChanged && this.state.trainerInfo){
            saveRouteFn.bind(this)({friendlyId: newUser.name, id: this.state.trainerInfo.id});
        }
    }.bind(this))
    .catch(function(err){
        console.error(err);
        $('.saveSuccess').hide();
        $('.saveError').show();
        clearTimeout(hideAlertError);
        hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
    }.bind(this));
}

function saveRouteFn(model){
    saveTrainerRoute(model)
    .then(function(data){
        let newData = this.state.trainerInfo;
        newData.friendlyId = data.friendlyId;
        if(data.hasErrors){            
            //ToDo: show warning
            newData.friendlyIdErrors = true;            
        }
        this.setState({trainerInfo: newData});

        $('.saveError').hide();
        $('.saveSuccess').show();
        clearTimeout(hideAlertSuccess);
        hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
    }.bind(this))
    .catch(function(err){
        console.error(err);
        $('.saveSuccess').hide();
        $('.saveError').show();
        clearTimeout(hideAlertError);
        hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
    }.bind(this));
}

function loadClientData(id){
    loadUser(id)
    .then((userData) => {
        setUser.call(this, userData);
    });

    this.setState({userData: {}});

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
    if(user.role == 'trainer'){
        loadNotifications()
            .then((data) => this.setState({notifications: data}));
        loadTrainerInfo()
            .then((data) => this.setState({trainerInfo: data}));
    }
    this.setState({user: user, gmail: user.email, feedPlans: userData.feedPlans, trainPlans: userData.trainPlans});
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
        saveHandler = debounce(() => saveUserFn.bind(this)(newUser), 1000);
        saveHandler();
    });    
}

class Profile extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            user:{},
            userData:{},
            feedPlans:[],
            trainPlans:[],
            notifications:{},
            trainerInfo: {}
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
        if(fieldName == 'name' && this.state.user.role == 'trainer'){
            newUser.nameChanged = true;
        }
        newUser[fieldName] = fieldVal
        this.setState({user: newUser});        

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveUserFn.bind(this)(newUser), 1000);        
        saveHandler();
    }

    handleTrainerChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newInfo = this.state.trainerInfo;        
        newInfo[fieldName] = fieldVal
        this.setState({trainerInfo: newInfo});        

        if(saveTrainerHandler){
            saveTrainerHandler.clear();
        }
        saveTrainerHandler = debounce(() => saveTrainerInfo.bind(this)(newInfo), 1000);        
        saveTrainerHandler();
    }

    handleMailChange(event){
        let fieldVal = event.target.value;
        let isGmailCorrect = /^[a-z0-9](\.?[a-z0-9+]){5,}@g(oogle)?mail\.com$/.test(fieldVal);
        this.setState({gmail: fieldVal, isGmailCorrect: isGmailCorrect, gmailProviding: true});
        if(isGmailCorrect){
            updateEmail(fieldVal);
        }
    }

    handleTrainerCheckbox(event){
        let fieldName = event.target.name;
        let fieldVal = event.target.checked;
        let newData = this.state.trainerInfo;
        newData[fieldName] = fieldVal;
        this.setState({trainerInfo: newData});
        saveTrainerInfo(newData);
    }

    handleFriendlyIdChange(event){
        //ToDo: validate, present changes
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.trainerInfo;
        newData[fieldName] = fieldVal;
        this.setState({trainerInfo: newData});

        if(saveRouteHandler){
            saveRouteHandler.clear();
        }
        saveRouteHandler = debounce(() => saveRouteFn.bind(this)({friendlyId: fieldVal, id: newData.id}), 1000);
        saveRouteHandler();        
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
            saveHandler = debounce(() => saveUserFn.bind(this)(newUser), 100);        
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
        let downloadContainer = "";
        let helloPopup = "";
        let specializationForm = "";
        if(this.state.user.role == 'trainer'){
            //User sees hello message on goods screen
            if(this.state.notifications.helloMessage){
                helloPopup = <WelcomeScreen role={this.state.user.role}></WelcomeScreen>
            }
            invoiceForm = <FormGroup>
                <label className="col-lg-2 control-label">Dane do faktury: </label>
                <Col lg={ 10 }>
                    <textarea 
                    className="form-control" 
                    name='invoiceInfo'
                    value={this.state.trainerInfo.invoiceInfo || ''}
                    onChange={this.handleTrainerChange.bind(this)}></textarea>
                </Col>
            </FormGroup>  
            let gmailInputClass = '';
            if(this.state.gmailProviding){
                if(this.state.isGmailCorrect){
                    gmailInputClass = 'input-correct';
                }else{
                    gmailInputClass = 'parsley-error';
                }
            }
            specializationForm = <div className="form-horizontal">   
                <FormGroup>
                    <label className="col-lg-2 control-label" htmlFor="isFeedCounsultant">Prowadzę doradztwo dietetyczne</label>
                    <Col lg={ 4 } md={4} sm={6} xs={6}>
                        <div className="checkbox c-checkbox">
                          <label>
                              <input type="checkbox" name="isFeedCounsultant" id='isFeedCounsultant'
                              checked={this.state.trainerInfo.isFeedCounsultant || false} 
                              onChange={this.handleTrainerCheckbox.bind(this)} />
                              <em className="fa fa-check"></em>
                          </label>
                        </div>
                    </Col>
                </FormGroup> 
                <FormGroup>
                    <label className="col-lg-2 control-label" htmlFor="isTrainer">Prowadzę treningi personalne</label>
                    <Col lg={ 4 } md={4} sm={6} xs={6}>
                        <div className="checkbox c-checkbox">
                          <label>
                              <input type="checkbox" name="isTrainer" id='isTrainer'
                              checked={this.state.trainerInfo.isTrainer || false} 
                              onChange={this.handleTrainerCheckbox.bind(this)} />
                              <em className="fa fa-check"></em>
                          </label>
                        </div>                        
                    </Col>
                </FormGroup> 
                 <FormGroup>
                    <label className="col-lg-2 control-label">Konto gmail do synchronizacji kalendarza treningów:</label>
                    <Col lg={ 4 } md={4} sm={6} xs={6}>
                        <FormControl type="email" placeholder="Konto Gmail" 
                            className={gmailInputClass}
                            name='gmail'
                            value={this.state.gmail || ''}
                            onChange={this.handleMailChange.bind(this)}/>
                    </Col>
                </FormGroup> 
                <FormGroup>
                    <label className="col-lg-2 control-label">Adres strony w serwisie:</label>
                    <Col lg={ 10 }>
                        <FormControl type="text" placeholder="Adres strony w serwisie" 
                        className="form-control"
                        name='friendlyId'
                        value={this.state.trainerInfo.friendlyId || ""}
                        onChange={this.handleFriendlyIdChange.bind(this)}/>
                    </Col>
                </FormGroup> 
            </div>
        }
        let readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true};
            if(this.state.userData.id){
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
                    downloadContainer = <div>                       
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
                        {specializationForm}   
                        {invoiceForm} 
                        {downloadContainer}
                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                            Dane zapisane poprawnie.
                        </div>  
                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                            Nie udało się zapisać dane.
                        </div>
                    </form>
                    {picForm}
                    {helloPopup}
                </Panel>
        );
    }

}

export default Profile;

