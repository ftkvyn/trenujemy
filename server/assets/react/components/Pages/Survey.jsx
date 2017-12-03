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

function formatHour(val) {
    val = '' + val;
    val = val.replace(':','');
    if(isNaN(+val)){
        return '0000';
    }
    if(+val >= 2400){
        return '23:59';
    }
    while(val.length < 4){
        val = '0' + val;
    }
    return val;
}

function setUser(userData, me){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    userData.wakeUpHour = formatHour(userData.wakeUpHour);
    userData.goToBedHour = formatHour(userData.goToBedHour);
    me.setState({data: userData},
        () =>{
            if($.fn.inputmask){
                $('[data-masked]').inputmask();
                $('[data-masked]').off('change');
                $('[data-masked]').change(me.handleChange.bind(me));
            }
        });
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
        if(typeof $(event.target).attr('data-masked') != 'undefined'){
            fieldVal = fieldVal.replace(':','');   
        }
        let newData = this.state.data;
        if(fieldName.indexOf('.') == -1){
            newData[fieldName] = fieldVal
        }else{
            let fields = fieldName.split('.');
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
        if(!this.state.data.id){
            return <Panel></Panel>
        }
        var readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true, disabled: 'disabled'};
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
                        <label className="col-lg-3 col-md-4 control-label">Twój główny cel:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="weight"
                                    checked={this.state.data.target === 'weight'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę zbudować masę i powiększyć mięśnie
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="cut"
                                    checked={this.state.data.target === 'cut'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę wyrzeźbić mięśnie
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="slim"
                                    checked={this.state.data.target === 'slim'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę schudnąć
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="power"
                                    checked={this.state.data.target === 'power'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę zwiększyć siłę
                                </label>
                            </div>
                        </Col>
                    </FormGroup>
                    <legend>2) Typ sylwetki</legend>
                    <div style={{'paddingLeft':'50px','paddingBottom':'20px'}}>
                        <img src='/images/body_types.jpg'/>
                        <div>
                            <label style={{'margin':'0 46px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="1"
                                checked={this.state.data.bodyType == '1'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                            <label style={{'margin':'0 46px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="2"
                                checked={this.state.data.bodyType == '2'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                            <label style={{'margin':'0 52px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="3"
                                checked={this.state.data.bodyType == '3'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                        </div>
                    </div>
                    <legend>2) Osobiste zwyczaje</legend>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Godzina pobudki:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Godzina pobudki" 
                            className="form-control" {...readonlyProps}
                            data-masked="" data-inputmask="'mask': '99:99'" 
                            name='wakeUpHour'
                            value={this.state.data.wakeUpHour}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Godzina chodzenia spać:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Godzina chodzenia spać" 
                            className="form-control" {...readonlyProps}
                            data-masked="" data-inputmask="'mask': '99:99'" 
                            name='goToBedHour'
                            value={this.state.data.goToBedHour}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Czy jesteś gotowy zmienić swój dzienny plan aby dostosować sie do zaleceń trenera?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="canYouChangeDailyPlan" 
                            value={this.state.data.canYouChangeDailyPlan || 'no'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='no'>Nie</option>
                                <option value='rather_no'>Raczej nie</option>
                                <option value='rather_yes'>Raczej tak</option>
                                <option value='yes'>Zdecydowanie tak</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Rodzaj wykonywanej pracy:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Rodzaj wykonywanej pracy" 
                            className="form-control" {...readonlyProps}
                            name='workType'
                            value={this.state.data.workType}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <legend>3) Ankieta treningowa</legend>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Kark:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Kark" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.neck'
                            value={this.state.data.bodySize.neck}
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
