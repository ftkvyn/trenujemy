import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadSurvey, saveSurvey } from '../Common/userDataService';
import { saveImage, saveFile } from '../Common/filesService';

let hideAlertSuccess = null;
let hideAlertError = null;

function saveUserFn(newData){
    saveSurvey(newData)
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

function setUser(userData, me){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    me.setState({data: userData});
}

let saveHandler = null;

class Survey extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{
                bodySize:{}
            }
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
        loadSurvey(nextId)
            .then((data) => setUser(data, me));
    }

    componentDidMount(){
        let me = this;
        loadSurvey(this.state.userId)
            .then((data) => setUser(data, me));
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.data;
        if(fieldName.indexOf('.') == -1){
            newData[fieldName] = fieldVal
        }else{
            let fields = fieldName.split('.');
            console.log(fields);
            newData[fields[0]][fields[1]] = fieldVal || 0;
        }
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveUserFn(newData), 1000);        
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
        var fileData = $('#bodyPicInput')[0].files[0];
        formData.append('file', fileData);
        saveImage(formData)
        .then(function(data){
            let newData = me.state.data;
            newData.bodyPicture = data.url;
            me.setState({data: newData});
            if(saveHandler){
                saveHandler.clear();
            }
            saveHandler = debounce(() => saveUserFn(newData), 100);        
            saveHandler();
        })
        .catch(function(err){
            $('.saveError').show();
            clearTimeout(hideAlertError);
            hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
        });
    }

    render() {  
        var readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true};
        }
        var picForm = "";
        if(!this.state.userId){
            picForm = <form id='bodyPicForm' style={{display:'none'}}>
                <input type='file' name='file' id='profilePicInput' onChange={this.uploadImage.bind(this)}/>
            </form>
        }
        return (
              <Panel>
                    <form className="form-horizontal">     
                        <FormGroup>
                            <label className="col-lg-2 control-label">Rodzaj wykonywanej pracy:</label>
                            <Col lg={ 10 }>
                                <FormControl type="text" placeholder="Rodzaj wykonywanej pracy" 
                                className="form-control" {...readonlyProps}
                                name='workType'
                                value={this.state.data.workType || ''}
                                onChange={this.handleChange.bind(this)}/>
                            </Col>
                        </FormGroup> 
                        <FormGroup>
                            <label className="col-lg-2 control-label">Kark:</label>
                            <Col lg={ 10 }>
                                <FormControl type="number" placeholder="Kark" 
                                className="form-control" {...readonlyProps}
                                name='bodySize.neck'
                                value={this.state.data.bodySize.neck || 0}
                                onChange={this.handleChange.bind(this)}/>
                            </Col>
                        </FormGroup> 
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

export default Survey;

