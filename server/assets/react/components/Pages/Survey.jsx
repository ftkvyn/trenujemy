import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadUser, saveUser } from '../Common/userDataService';
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

class Survey extends React.Component {
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
        //ToDo: move to service and use service in Profile.jsx
        let me = this;
        var fd = new FormData();
        var fileData = $('#profilePicInput')[0].files[0];
        fd.append('file', fileData);
        $.ajax({
            // Your server script to process the upload
            url: '/api/uploadImage',
            type: 'POST',

            // Form data
            data: fd,

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',

            // Custom XMLHttpRequest
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function(e) {
                        
                    } , false);
                }
                return myXhr;
            },
            success: function (data) {
                let newUser = me.state.user;
                newUser.profilePic = data.url;
                me.setState({user: newUser});
                if(saveHandler){
                    saveHandler.clear();
                }
                saveHandler = debounce(() => saveUserFn(newUser), 100);        
                saveHandler();
            },
            error: function(err){
                console.error(err);
                $('.saveError').show();
                clearTimeout(hideAlertError);
                hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
            }
        });
    }

    render() {  
        var readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true};
        }
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
                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                            Dane zapisane poprawnie.
                        </div>  
                        <div role="alert" className="alert alert-success saveError" style={{display:'none'}}>
                            Nie udało się zapisać dane.
                        </div>
                    </form>
                    {picForm}
                </Panel>
        );
    }

}

export default Survey;

