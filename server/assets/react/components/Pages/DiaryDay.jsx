import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import {loadDay, saveDay, saveTraining, saveBodySize} from '../Common/diaryService'
import { loadSurvey } from '../Common/userDataService';
import { saveImage } from '../Common/filesService';

function setDay(dayData){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    const dayDataFlat = dayData;
    const bodySize = dayData.bodySize;
    const trainings = dayData.trainings;
    delete dayDataFlat.bodySize;
    delete dayDataFlat.trainings;
    this.setState({data: dayDataFlat, bodySize: bodySize, trainings: trainings || []});
}

let saveHandler = null;
let saveBodyHandler = null;

let hideAlertSuccess = null;
let hideAlertError = null;

function saveDataFn(newData){
    saveDay(newData)
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

function saveBodyFn(newData){
    saveBodySize(newData)
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

class DiaryDay extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{},
            survey:{},
            bodySize:{},
            trainings:[],
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
            initialState.day = this.props.match.params.day;
        }
        this.state = initialState; 
        loadSurvey(initialState.userId)
            .then((data) => {
              this.setState({survey: data});
            });      
    };

    componentWillReceiveProps(nextProps) {
        let nextDay = undefined;
        if(nextProps.match && nextProps.match.params){
            nextDay = nextProps.match.params.day;
        }
        if(this.state.day === nextDay){
            return;
        }
        this.setState({day: nextDay, data:{}, bodySize:{}, trainings: []});
        loadDay(nextDay, this.state.userId)
          .then((data) => setDay.call(this, data));
    }

    componentDidMount(){
        loadDay(this.state.day, this.state.userId)
          .then((data) => setDay.call(this, data));
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.data;
        newData[fieldName] = fieldVal
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();
    }

    handleBodySizeChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.bodySize;
        newData[fieldName] = fieldVal
        this.setState({bodySize: newData});

        if(saveBodyHandler){
            saveBodyHandler.clear();
        }
        saveBodyHandler = debounce(() => saveBodyFn(newData), 1000);        
        saveBodyHandler();
    }

    imageClick(event){
        if(this.state.userId){
            return;
        }
        $('#dailyPicInput').click();
    }

    uploadImage(){
        var formData = new FormData();
        var fileData = $('#dailyPicInput')[0].files[0];
        formData.append('file', fileData);
        saveImage(formData)
        .then((data) => {
            let newData = this.state.data;
            newData.image = data.url;
            this.setState({data: newData});
            if(saveHandler){
                saveHandler.clear();
            }
            saveHandler = debounce(() => saveDataFn(newData), 100);        
            saveHandler();
        })
        .catch(function(err){
            $('.saveError').show();
            clearTimeout(hideAlertError);
            hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
        });
    }

    render() {  
        if(this.state.data.noData){
          return <p>Nie ma danych od użytkownika odnośnie tego dnia.</p>
        }
        if(!this.state.data.id){
          return <div></div>
        }
        let readonlyForUser = {};
        let readonlyForTrainer = {};
        if(this.state.userId){
          readonlyForTrainer = {readOnly: true};
        }else{
          readonlyForUser = {readOnly: true};
        }
        let picForm = ""; 
        if(!this.state.userId){
            picForm = <form id='dailyPicForm' style={{display:'none'}}>
                <input type='file' name='file' id='dailyPicInput' accept="image/x-png,image/gif,image/jpeg" onChange={this.uploadImage.bind(this)}/>
            </form>
        }
        let surveyPart = "";
        if(this.state.survey.id && this.state.bodySize.id){
          let dailyPic = "";
          if(this.state.data.image){
            dailyPic = <img src={this.state.data.image} className='daily-pic' onClick={this.imageClick.bind(this)}/>
          }else{
            if(!this.state.userId){
              dailyPic = <button onClick={this.imageClick.bind(this)} className='btn btn-outline btn-primary'>Załaduj zdjęcie</button>
            }else{
              dailyPic = <p>Brak zdjęcia</p>
            }
          }                   
          surveyPart = <div>
              <legend>Pomiary ciała, zdjęcia</legend>
              <label className="col-lg-12">Zaktualizuj swoje wymiary</label>
              <FormGroup className='form-inline'>
                  <label className="col-lg-2 col-md-2 control-label label-stub"> </label>
                  <label className="col-lg-3 col-md-3 hidden-sm hidden-xs">Dziś:</label>
                  <label className="col-lg-3 col-md-3 hidden-sm hidden-xs">W ankiecie początkowej:</label>
                  <label className="col-lg-4 col-md-4 control-label label-stub"> </label>
                  <label className="col-lg-2 col-md-2 control-label">Waga:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Waga" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='weight'
                      value={this.state.data.weight || 0}
                      onChange={this.handleChange.bind(this)}/> kg
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Waga" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.weight}/> kg
                  </Col>
              </FormGroup>
              <label className="col-lg-12">Wymiary</label>
              <label className="col-lg-2 col-md-2 control-label label-stub"> </label>
              <label className="col-lg-3 col-md-3 hidden-sm hidden-xs">Dziś:</label>
              <label className="col-lg-3 col-md-3 hidden-sm hidden-xs">W ankiecie początkowej:</label>
              <label className="col-lg-4 col-md-4 control-label label-stub"> </label>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Kark:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Kark" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='neck'
                      value={this.state.bodySize.neck || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Kark" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.neck}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Ramię:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Ramię" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='shoulder'
                      value={this.state.bodySize.shoulder || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Ramię" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.shoulder}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Przedramię:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Przedramię" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='forearm'
                      value={this.state.bodySize.forearm || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Przedramię" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.forearm}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Nadgarstek:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Nadgarstek" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='wrist'
                      value={this.state.bodySize.wrist || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Nadgarstek" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.wrist}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Klatka piersiowa:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Klatka piersiowa" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='chest'
                      value={this.state.bodySize.chest || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Klatka piersiowa" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.chest}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Talia (brzuch):</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Talia (brzuch)" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='waist'
                      value={this.state.bodySize.waist || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Talia (brzuch)" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.waist}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Biodra:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Biodra" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='hips'
                      value={this.state.bodySize.hips || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Biodra" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.hips}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Udo:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Udo" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='thigh'
                      value={this.state.bodySize.thigh || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Udo" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.thigh}/> cm
                  </Col>
              </FormGroup>
              <FormGroup className='form-inline'>                  
                  <label className="col-lg-2 col-md-2 control-label">Łydka:</label>
                  <Col lg={ 3 } md={ 3 }>
                      <FormControl type="number" placeholder="Łydka" 
                      className="form-control short-input" {...readonlyForTrainer}
                      name='shin'
                      value={this.state.bodySize.shin || 0}
                      onChange={this.handleBodySizeChange.bind(this)}/> cm
                  </Col>
                  <Col lg={ 3 } md={ 3 } className="hidden-sm hidden-xs">
                      <FormControl type="number" placeholder="Łydka" 
                      className="form-control short-input" readOnly={true}
                      defaultValue={this.state.survey.bodySize.shin}/> cm
                  </Col>
              </FormGroup>
              <FormGroup>
                  <label className="col-lg-12">Załaduj zdjęcie sylwetki</label>
                  <label className="col-lg-3 col-md-3">Dziś: </label>
                  <label className="col-lg-9 col-md-9 control-label label-stub"> </label>
                  <Col lg={ 3 } md={ 3 }>
                    {dailyPic}
                  </Col>
              </FormGroup>
          </div>
        }
        return (
            <div>
              <form className="form-horizontal">
                <FormGroup>
                    <label className="col-lg-12 text-center">Twoje uwagi dotyczące tego dnia (pytania do trenera, komentarze):</label>
                    <Col lg={2} md={1}></Col>
                    <Col lg={ 8 } md={10}>
                        <textarea 
                        maxLength='800'
                        className="form-control" 
                        name='userNotes' {...readonlyForTrainer}
                        value={this.state.data.userNotes || ''}
                        onChange={this.handleChange.bind(this)}></textarea>
                        <label className="col-lg-12 control-label">Maks. 800 znaków</label>
                    </Col>
                    <Col lg={2} md={1}></Col>

                </FormGroup>  

                <FormGroup>
                    <label className="col-lg-12 text-center">Uwagi trenera do Twojego dnia:</label>
                    <Col lg={2} md={1}></Col>
                    <Col lg={ 8 } md={10}>
                        <textarea 
                        className="form-control" 
                        name='trainerNotes' {...readonlyForUser}
                        value={this.state.data.trainerNotes || ''}
                        onChange={this.handleChange.bind(this)}></textarea>
                    </Col>
                    <Col lg={2} md={1}></Col>
                </FormGroup>                  
                {surveyPart}
                 <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                    Dane zapisane poprawnie.                
                </div>  
                <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                    Nie udało się zapisać dane.
                </div>                
              </form>
              {picForm}
            </div>        

        );
    }

}

export default withRouter(DiaryDay);

