import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadDay, saveDay, saveTraining, saveBodySize, getPastImages } from '../Common/diaryService'
import { loadSurvey } from '../Common/userDataService';
import { saveImage } from '../Common/filesService';
import { loadDishes, saveDish } from '../Common/dishService'
import moment from 'moment';
import AddComponentFirstStep from './AddComponentFirstStep'
import AddComponentSecondStep from './AddComponentSecondStep'

function setDay(dayData){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    const dayDataFlat = dayData;
    const bodySize = dayData.bodySize;
    const trainings = dayData.trainings;
    delete dayDataFlat.bodySize;
    delete dayDataFlat.trainings;
    delete dayDataFlat.dishes;
    this.setState({data: dayDataFlat, bodySize: bodySize, trainings: trainings || []});
    const date = moment(dayData.date).format('DD-MM-YYYY');
    getPastImages(date, this.state.userId)
      .then((images) => this.setState({pastImages: images}));
    loadDishes(dayData.id)
      .then((dishes) => {
        for(var i = 0; i < dishes.length; i++){
          dishes[i].__collapsed = i > 0;
          dishes[i].hour = formatHour(dishes[i].hour);
        }        
        this.setState({dishes: dishes},() =>{
            if($.fn.inputmask){
                $('[data-masked]').inputmask();
                $('[data-masked]').off('change');
                $('[data-masked]').change(this.handleDishHourChange.bind(this));
            }
        });
    });
}

function formatHour(val) {
    val = '' + val;
    val = val.replace(':','');
    if(isNaN(+val)){
        return '0000';
    }
    if(+val >= 2400){
        return '2359';
    }
    while(val.length < 4){
        val = '0' + val;
    }
    return val;
}

let saveHandler = null;
let saveTraningHandlers = [null, null, null];
let saveDishHandlers = [];
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
            dishes:[],
            pastImages:[],
            addingTraning: false,
            rootPath: this.props.location.pathname
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
        this.setState({day: nextDay, data:{}, bodySize:{}, trainings: [], dishes:[]});
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

    addTraining(){
      this.setState({addingTraning: true});
      let newTraning = {dailyReport: this.state.data.id};
      saveTraining(newTraning)
        .then((createdTraning) => {
          let trainings = [...this.state.trainings, createdTraning];
          this.setState({addingTraning: false, trainings: trainings});
        });
    }

    handleDishHourChange(num, event) {
        if(typeof event == 'undefined'){
          event = num;
          num = +$(event.target).attr('data-num');
        }
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        if(fieldName == 'hour'){
            fieldVal = fieldVal.replace(':','');   
        }  
        let newData = this.state.dishes[num];
        newData[fieldName] = fieldVal;
        let dishes = [
          ...this.state.dishes.slice(0, num),
          newData,
          ...this.state.dishes.slice(num+1)
        ];
        this.setState({dishes: dishes});

        
        if(saveDishHandlers[num]){
            saveDishHandlers[num].clear();
        }
        saveDishHandlers[num] = debounce(() => {
          saveDish(newData)
            .then((saved) => {
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
        }, 1000);        
        saveDishHandlers[num]();
    }

    collapseDish(num){
        let newData = this.state.dishes[num];
        newData.__collapsed = !newData.__collapsed;
        let dishes = [
          ...this.state.dishes.slice(0, num),
          newData,
          ...this.state.dishes.slice(num+1)
        ];
        this.setState({dishes: dishes});
    }

    handleTrainingChange(num, event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.trainings[num];
        newData[fieldName] = fieldVal;
        let trainings = [
          ...this.state.trainings.slice(0, num),
          newData,
          ...this.state.trainings.slice(num+1)
        ];
        this.setState({trainings: trainings});

        
        if(saveTraningHandlers[num]){
            saveTraningHandlers[num].clear();
        }
        saveTraningHandlers[num] = debounce(() => {
          saveTraining(newData)
            .then((savedTraning) => {
                let newData = this.state.trainings[num];
                newData.calories = savedTraning.calories;
                let trainings = [
                  ...this.state.trainings.slice(0, num),
                  newData,
                  ...this.state.trainings.slice(num+1)
                ];
                this.setState({trainings: trainings});

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
        }, 1000);        
        saveTraningHandlers[num]();
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
        let addTrainingBtn = "";
        if(this.state.trainings.length < 3 && !this.state.addingTraning && this.state.data.id && !this.state.userId){
          addTrainingBtn = <FormGroup>
              <div className="col-lg-12 text-center">
                <div onClick={this.addTraining.bind(this)} className='btn btn-outline btn-primary'>Dodaj kolejny trening</div>
              </div>
          </FormGroup>  
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
              dailyPic =<div> 
                <div onClick={this.imageClick.bind(this)} className='btn btn-outline btn-primary'>Załaduj zdjęcie</div>
              </div>
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
                  <Col lg={ 3 } md={ 3 }>
                    <label className="col-lg-12">Dziś: </label>
                    {dailyPic}
                  </Col>
                  {this.state.pastImages.map((item, num) => <Col lg={ 3 } md={ 3 } key={num}>
                    <label className="col-lg-12">{item.date}</label>
                    <img className='daily-pic' src={item.image} />
                  </Col>)}
              </FormGroup>
          </div>
        }
        return (
            <div>
              <div className="popup-overlay"></div>
              <Route path={this.state.rootPath  + `/dish/:dishId/addComponent`} component={AddComponentFirstStep}/>
              <Route path={this.state.rootPath  + `/dish/:dishId/addComponent/:componentNum/quantity`} component={AddComponentSecondStep}/>
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


                {this.state.dishes.map((dish, num) => <div key={num} className='dish-item'>                      
                      <div className='dish-header'>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            <em className="fa fa-arrow-circle-o-down" 
                              style={!dish.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseDish.bind(this, num)}></em>
                            <em className="fa fa-arrow-circle-o-up" 
                              style={dish.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseDish.bind(this, num)}></em>
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={8} xs={8}>
                          <FormGroup className='form-inline'>                  
                              <label className="col-lg-6 col-md-6 col-sm-6 col-xs-6">{"Posiłek " + (num + 1)}</label>
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  Godzina:
                                  <FormControl type="text"
                                  className="form-control short-input" {...readonlyForTrainer}
                                  name='hour'
                                  data-num={num}
                                  data-masked="" data-inputmask="'mask': '99:99'" 
                                  value={dish.hour || 0}
                                  onChange={this.handleDishHourChange.bind(this, num)}/>
                              </Col>
                          </FormGroup>
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            <Link to={this.state.rootPath  + `/dish/${dish.id}/addComponent`}>
                                <em className="fa fa-plus-square"></em>
                            </Link>
                          </div>
                        </Col>
                      </div>
                      <div className='dish-body' style={dish.__collapsed ? {display: 'none'} : {}}>
                        <Col lg={3} md={3} sm={4} xs={4}>
                          <label className="control-label">Uwagi i pytania do trenera:</label>
                        </Col>
                        <Col  lg={9} md={9} sm={8} xs={8}>
                            <textarea 
                            maxLength='400'
                            className="form-control" 
                            name='comment' {...readonlyForTrainer}
                            value={dish.comment || ''}
                            onChange={this.handleDishHourChange.bind(this, num)}></textarea>
                            <label className="col-lg-12 control-label">Maks. 400 znaków</label>
                        </Col>
                      </div>
                  </div>)}

                {this.state.trainings.map((training, num) => <FormGroup key={num}>
                    <label className="col-lg-12">{`Trening ${num+1}:`}</label>
                    <Col lg={2} md={1}></Col>
                    <Col lg={2} md={2} sm={3}>
                      <FormControl componentClass="select" name="type" 
                        value={training.type}
                        onChange={this.handleTrainingChange.bind(this, num)}
                        {...readonlyForTrainer}
                        className="form-control">
                            <option value='none'>Brak</option>
                            <option value='gym'>Siłownia</option>
                            <option value='bicycle'>Rower</option>
                            <option value='rollers'>Rolki</option>
                            <option value='jogging'>Jogging</option>
                            <option value='swimming'>Pływanie</option>
                            <option value='walk'>Spacer</option>
                        </FormControl>
                    </Col>
                    <Col lg={1} md={1} sm={1}>
                      <label className="control-label">Minuty:</label>
                    </Col>
                    <Col lg={2} md={2} sm={3}>
                        <FormControl type="number"
                        className="form-control" {...readonlyForTrainer}
                        name='length'
                        value={training.length || 0}
                        onChange={this.handleTrainingChange.bind(this, num)}/>
                    </Col>
                    <Col lg={2} md={2} sm={3}>
                      <label className="control-label">Kalorie spalone (w przybliżeniu):</label>
                    </Col>
                    <Col lg={2} md={2} sm={3}>                        
                        <FormControl type="number"
                        className="form-control short-input" readOnly={true}
                        value={training.calories || 0}/>
                    </Col>
                    <label className="col-lg-12 text-center"></label>
                    <Col lg={2} md={1}></Col>
                    <Col lg={ 8 } md={10}>
                        <textarea 
                        className="form-control" 
                        maxLength='800'
                        name='text' {...readonlyForTrainer}
                        value={training.text || ''}
                        onChange={this.handleTrainingChange.bind(this, num)}></textarea>
                        <label className="col-lg-12 control-label">Maks. 800 znaków</label>
                    </Col>
                    <Col lg={2} md={1}></Col>
                </FormGroup>   
                )}
                {addTrainingBtn}

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

