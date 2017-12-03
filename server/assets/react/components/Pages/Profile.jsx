import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUser, saveUser } from '../Common/userDataService';
import { saveImage } from '../Common/filesService';
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

function loadClientData(id, me){
    loadClients()
    .then(function(clients){
        for (var i = clients.length - 1; i >= 0; i--) {
            if(clients[i].id == id){
                setUser(clients[i], me);
                return;
            }
        }
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

function setUser(userData, me){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    destroyDp();
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
        console.log('change');
        console.log(e);
        let newDate = e.date.toDate().toISOString();
        let newUser = me.state.user;
        newUser.birthday = newDate
        me.setState({user: newUser});

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
            user:{}
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
        let me = this;
        this.setState({userId: nextId});
        if(!nextId){
            loadUser()
            .then((data) => setUser(data, me));
        }else{
            loadClientData(nextId, me);
        }
    }

    componentDidMount(){
        let me = this;
        if(!this.state.userId){
            loadUser()
            .then((data) => setUser(data, me));
        }else{
            loadClientData(this.state.userId, me);
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

    imageClick(event){
        if(this.state.userId){
            return;
        }
        $('#profilePicInput').click();
    }

    uploadImage(){
        let me = this;
        var formData = new FormData();
        var fileData = $('#profilePicInput')[0].files[0];
        formData.append('file', fileData);
        saveImage(formData)
        .then(function(data){
            let newUser = me.state.user;
            newUser.profilePic = data.url;
            me.setState({user: newUser});
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
        var readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true};
        }
        var profilePic = this.state.user.profilePic || '/images/no_image_user.png';
        var picForm = "";
        if(!this.state.userId){
            picForm = <form id='profilePicForm' style={{display:'none'}}>
                <input type='file' name='file' id='profilePicInput' onChange={this.uploadImage.bind(this)}/>
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

