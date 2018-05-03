import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadDay, saveDay, saveTraining, saveBodySize, getPastImages } from '../Common/diaryService'
import { loadSurvey, loadUser } from '../Common/userDataService';
import { saveImage } from '../Common/filesService';
import { loadDishes, saveDish, addUpdateDishHandler, removeUpdateDishHandler, removeComponent } from '../Common/dishService'
import { updateNotifications, saveNotifications, loadNotifications } from '../Common/notificationsService';
import { loadUserAdvice } from '../Common/adviceService';
import { loadAnswers } from '../Common/answerTemplatesService';
import moment from 'moment';
import AddComponentFirstStep from './AddComponentFirstStep'
import AddComponentSecondStep from './AddComponentSecondStep'
import DishInfo from '../Components/DishInfo'
import FoodInfoRow from '../Components/FoodInfoRow'

function updateDish(component){
  let num = this.state.dishes.findIndex((item) => item.id == component.dish);
  if(num > -1){
    let dish = this.state.dishes[num];
    if(!component.__removed){
      dish.components.push(component);
    }else{      
      let compNum = dish.components.findIndex((item) => item.id == component.id);
      let components =  [
        ...dish.components.slice(0, compNum),
        ...dish.components.slice(compNum + 1)
      ];
      dish.components = components;
    }
    let dishes = [
      ...this.state.dishes.slice(0, num),
      dish,
      ...this.state.dishes.slice(num+1)
    ];
    this.setState({dishes: dishes});
  }
}

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
                $('[data-masked]').change(this.handleDishChange.bind(this));
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

function getRootPath(path){
  let index = path.indexOf('/dish');
  if(index > -1){
    path = path.substring(0, index);
  }  
  return path;
}

function clearDayNotifications(){
    if(!this.state.userId){
        if(this.state.notifications.id && this.state.notifications.diaryDays.length){
          let days = this.state.notifications.diaryDays;

          if(days.some( day => day == this.state.day )){
            let newDays = days.filter( day => day != this.state.day);
            saveNotifications({id: this.state.notifications.id, diaryDays: newDays});
            updateNotifications({diaryDays: newDays});
            let notifications = this.state.notifications;
            notifications.diaryDays = newDays;
            this.setState({notifications: notifications});
          }              
        }        
      }
}

class DiaryDay extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{},
            survey:{},
            bodySize:{},
            trainings:[],
            userData:{},
            advise:{},
            dishes:[],
            templates: [],
            pastImages:[],
            addingTraning: false,
            notifications:{
                diaryDays: []
            },
            __sizeCollapsed: true,
            __foodCollapsed: false
        };
        initialState.updateHandlerToken = addUpdateDishHandler(updateDish.bind(this));
        initialState.rootPath = getRootPath(this.props.location.pathname);
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
            initialState.day = this.props.match.params.day;
        }
        if(initialState.userId){
            initialState.rootRoute = "/clients/:id/diary/:day";        
        }else{
            initialState.rootRoute = "/diary/:day";
        }
        this.state = initialState;             
    }

    componentWillReceiveProps(nextProps) {
        let nextDay = undefined;
        if(nextProps.match && nextProps.match.params){
            nextDay = nextProps.match.params.day;
        }
        if(this.state.day === nextDay){
            return;
        }
        this.setState({day: nextDay, data:{}, bodySize:{}, trainings: [], dishes:[], rootPath : getRootPath(nextProps.location.pathname)});
        loadDay(nextDay, this.state.userId)
          .then((data) => setDay.call(this, data));
        //Not loading survey here because here only days are changing. 
        //Users changing with unmounting and recreating component.  
        clearDayNotifications.call(this);
    }

    componentDidMount(){
        loadDay(this.state.day, this.state.userId)
          .then((data) => setDay.call(this, data)); 
        loadSurvey(this.state.userId)
            .then((data) => {
                if(!data.bodySize){
                    data.bodySize = {};
                }
              this.setState({survey: data});
            });    
        loadUserAdvice(this.state.userId)
            .then((data) => {
              this.setState({advise: data});
            });  
        loadUser(this.state.userId)
            .then((userData) => {              
                this.setState({userData: userData});
            });     
        if(this.state.userId){
          loadAnswers()
            .then((data) => this.setState({templates: data})); 
        }  
        if(!this.state.userId){
          loadNotifications()
          .then(data => {     
              let model = Object.assign({}, this.state.notifications);  
              if(data.diaryDays){
                model.diaryDays = data.diaryDays;
              }      
              model.id = data.id; 
              this.setState({notifications: model});
          });
        }
    }

     componentWillUnmount(){
      clearDayNotifications.call(this);
    }

    createDishesDescription(){
        let dishes = [...this.state.dishes];
        for(let i = 0; i < dishes.length; i++){
            let dish = dishes[i];
            if(!dish.description && dish.components && dish.components.length){
                let description = '';
                for(let k = 0; k < dish.components.length; k++){
                    let component = dish.components[k];
                    description += `${component.name} - ${component.weight} g \n`;
                }
                this.handleDishChange(i, {target: {name: 'description', value: description}});
            }
        }
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        if(fieldName == 'isSimpleDishMode'){
            fieldVal = event.target.checked;
            if(fieldVal){
                this.createDishesDescription();
            }
        }
        let newData = this.state.data;
        newData[fieldName] = fieldVal
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();
    }

    useAnswerTemplate(event){
      let fieldVal = event.target.value;
      let template = this.state.templates.find((i) => i.id == fieldVal);
      if(template){
        let oldData = this.state.data;
        oldData.trainerNotes = template.text;
        this.setState({data: oldData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveDataFn(newData), 1000);        
        saveHandler();
      }
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

    handleDishChange(num, event) {
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

    deleteComponent(componentId, dishNum){
      let model = {
        id: componentId,
        dish: this.state.dishes[dishNum].id
      };
      removeComponent(this.state.data.id, model);
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

    collapseSizes(){
      this.setState({__sizeCollapsed : !this.state.__sizeCollapsed})
    }

    collapseFood(){      
      this.setState({__foodCollapsed : !this.state.__foodCollapsed})
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
        let simpleModeCheckbox = '';
        let readonlyForUser = {};
        let readonlyForTrainer = {};
        if(this.state.userId){
          readonlyForTrainer = {readOnly: true};          
        }else{
          readonlyForUser = {readOnly: true};
          simpleModeCheckbox = <FormGroup>
                <Col lg={2} md={1}></Col>
                <Col lg={ 8 } md={10}>
                    <label className="checkbox-inline c-checkbox">
                        <input type="checkbox" name="isSimpleDishMode" 
                        value="1" {...readonlyForTrainer}
                        className='needsclick'
                        checked={!!this.state.data.isSimpleDishMode} 
                        onChange={this.handleChange.bind(this)} />
                        <em className="fa fa-check"></em>Uproszczony opis posiłków
                    </label>
                </Col>
                <Col lg={2} md={1}></Col>                    
            </FormGroup> 
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
        let answerTemplates = "";
        if(this.state.userId && this.state.templates.length){
          answerTemplates = <FormControl componentClass="select" name="answer" 
                value={'none'}
                onChange={this.useAnswerTemplate.bind(this)}
                className="form-control">
                    <option value='none'>Wybierz szablon odpowiedzi</option>
                    {this.state.templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}
                </FormControl>
        }
        let dishFields = ["calories",
            "protein",
            "fat",
            "carbohydrate",
            "sodium",
            "potassium",
            "calcium",
            "iron",
            "vitaminC",
            "vitaminA",
            "fiber"];
        let totalComponents = {};            
        let dishesProcessed = this.state.dishes.map((original) => {
          let item = Object.assign({}, original);
          for(let i = 0; i < item.components.length; i++){
              for(let k = 0; k < dishFields.length; k++){
                  let field = dishFields[k];
                  if(!item[field]){
                    item[field] = 0;
                  }
                  if(!totalComponents[field]){
                    totalComponents[field] = 0;
                  }
                  item[field] += item.components[i][field];
                  totalComponents[field] += item.components[i][field];
              }
          }
          return item;
        });      
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
          surveyPart = <div className='size-item'>                      
                      <div className='size-header'>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            <em className="fa fa-arrow-circle-o-down" 
                              style={!this.state.__sizeCollapsed ? {display: 'none'} : {}}
                              onClick={this.collapseSizes.bind(this)}></em>
                            <em className="fa fa-arrow-circle-o-up" 
                              style={this.state.__sizeCollapsed ? {display: 'none'} : {}}
                              onClick={this.collapseSizes.bind(this)}></em>
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={8} xs={8}>
                          <legend>Pomiary ciała, zdjęcia</legend>
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2}>
                        </Col>
                      </div>
              <div className='dish-body' style={this.state.__sizeCollapsed ? {display: 'none'} : {}}>
                  <div className="col-lg-12 text-bold">Zaktualizuj swoje wymiary</div>
                  <FormGroup className='form-inline'>
                      <Row style={{margin:0}}>
                          <label className="col-lg-2 col-md-2 hidden-xs hidden-sm control-label label-stub"> </label>
                          <label className="col-lg-3 col-md-3 col-sm-6 col-xs-6 col-xs-6 ">Dziś:</label>
                          <label className="col-lg-3 col-md-3 col-sm-6 col-xs-6 col-xs-6 ">W ankiecie początkowej:</label>
                          <label className="col-lg-4 col-md-4 hidden-xs hidden-sm control-label label-stub"> </label>
                      </Row>
                      <label className="col-lg-2 col-md-2 control-label">Waga:</label>
                      <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                          <FormControl type="number" placeholder="Waga" 
                          className="form-control short-input" {...readonlyForTrainer}
                          name='weight'
                          value={this.state.data.weight || 0}
                          onChange={this.handleChange.bind(this)}/> kg
                      </Col>
                      <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="hidden-xs">
                          <FormControl type="number" placeholder="Waga" 
                          className="form-control short-input" readOnly={true}
                          defaultValue={this.state.survey.weight}/> kg
                      </Col>
                  </FormGroup>
                  <div className="col-lg-12 text-bold">Wymiary</div>
                  <Row>
                      <label className="col-lg-2 col-md-2 hidden-xs hidden-sm control-label label-stub"> </label>
                      <label className="col-lg-3 col-md-3 col-sm-6 col-xs-6 ">Dziś:</label>
                      <label className="col-lg-3 col-md-3 col-sm-6 col-xs-6 ">W ankiecie początkowej:</label>
                      <label className="col-lg-4 col-md-4 hidden-xs hidden-sm control-label label-stub"> </label>
                  </Row>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Kark:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Kark" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='neck'
                            value={this.state.bodySize.neck || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Kark" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.neck}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Ramię:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Ramię" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='shoulder'
                            value={this.state.bodySize.shoulder || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Ramię" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.shoulder}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Przedramię:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Przedramię" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='forearm'
                            value={this.state.bodySize.forearm || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Przedramię" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.forearm}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Nadgarstek:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Nadgarstek" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='wrist'
                            value={this.state.bodySize.wrist || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Nadgarstek" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.wrist}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Klatka piersiowa:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Klatka piersiowa" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='chest'
                            value={this.state.bodySize.chest || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Klatka piersiowa" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.chest}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Talia (brzuch):</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Talia (brzuch)" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='waist'
                            value={this.state.bodySize.waist || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Talia (brzuch)" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.waist}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Biodra:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Biodra" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='hips'
                            value={this.state.bodySize.hips || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Biodra" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.hips}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Udo:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Udo" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='thigh'
                            value={this.state.bodySize.thigh || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Udo" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.thigh}/> cm
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>                  
                        <label className="col-lg-2 col-md-2 control-label">Łydka:</label>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6}>
                            <FormControl type="number" placeholder="Łydka" 
                            className="form-control short-input" {...readonlyForTrainer}
                            name='shin'
                            value={this.state.bodySize.shin || 0}
                            onChange={this.handleBodySizeChange.bind(this)}/> cm
                        </Col>
                        <Col lg={ 3 } md={ 3 } sm={6} xs={6} className="">
                            <FormControl type="number" placeholder="Łydka" 
                            className="form-control short-input" readOnly={true}
                            defaultValue={this.state.survey.bodySize.shin}/> cm
                        </Col>
                    </FormGroup>
                <FormGroup className='daily-pics-container'>
                    <Col lg={ 12 } md={ 12 }>
                        <label className="">Załaduj zdjęcie sylwetki</label>
                    </Col>
                    <Col lg={ 3 } md={ 3 }>
                      <label className="col-lg-12">Dziś: </label>
                      {dailyPic}
                    </Col>
                    <Col lg={9} md={9}>
                        <Row>  
                            {this.state.pastImages.map((item, num) => <Col lg={ 3 } md={ 3 } className='text-center' key={num}>
                              <label className="">{item.date}</label><br/>
                              <img className='daily-pic' src={item.image} />
                            </Col>)}
                        </Row>
                    </Col>
                </FormGroup>
              </div>
          </div>
        }
        let foodInfo = "";
        if(!this.state.data.isSimpleDishMode){
            foodInfo = <div>
              <Row>
                <Col lg={2} md={2} sm={3} xs={4}></Col>
                <Col lg={1} md={1} sm={2} xs={2}><label>Dziś:</label></Col>
                <Col lg={7} md={7} sm={3} xs={2}></Col>
                <Col lg={2} md={2} sm={4} xs={4}><label>Zalecenie:</label></Col>
              </Row>              

              <FoodInfoRow title="Białka" today={totalComponents.protein} advise={this.state.advise.protein}></FoodInfoRow>
              <FoodInfoRow title="Tłuszcze" today={totalComponents.fat} advise={this.state.advise.fat}></FoodInfoRow>
              <FoodInfoRow title="Węglowodany" today={totalComponents.carbohydrate} advise={this.state.advise.carbo}></FoodInfoRow>
              <FoodInfoRow title="Kalorie" today={totalComponents.calories} advise={this.state.advise.calories}></FoodInfoRow>
              <div className='dish-item' 
    style={this.state.advise.show_fiber || this.state.advise.show_sodium || this.state.advise.show_potassium
    || this.state.advise.show_calcium || this.state.advise.show_iron 
    || this.state.advise.show_vitaminC || this.state.advise.show_vitminA ? {} : {display: 'none'}}>                      
                <div className='dish-header'>
                  <Col lg={1} md={1} sm={2} xs={2}>
                    <div>
                      <em className="fa fa-arrow-circle-o-down" 
                        style={!this.state.__foodCollapsed ? {display: 'none'} : {}}
                        onClick={this.collapseFood.bind(this)}></em>
                      <em className="fa fa-arrow-circle-o-up" 
                        style={this.state.__foodCollapsed ? {display: 'none'} : {}}
                        onClick={this.collapseFood.bind(this)}></em>
                    </div>
                  </Col>
                  <Col lg={10} md={10} sm={8} xs={8}>
                    <legend>Pozostałe</legend>
                  </Col>
                  <Col lg={1} md={1} sm={2} xs={2}>
                  </Col>
                </div>
                <div className='dish-body' style={this.state.__foodCollapsed ? {display: 'none'} : {}}>
                  <FoodInfoRow title="Błonnik" today={totalComponents.fiber} advise={this.state.advise.fiber} hide={!this.state.advise.show_fiber}></FoodInfoRow>
                  <FoodInfoRow title="Sód" today={totalComponents.sodium} advise={this.state.advise.sodium} hide={!this.state.advise.show_sodium}></FoodInfoRow>
                  <FoodInfoRow title="Potas" today={totalComponents.potassium} advise={this.state.advise.potassium} hide={!this.state.advise.show_potassium}></FoodInfoRow>
                  <FoodInfoRow title="Wapń" today={totalComponents.calcium} advise={this.state.advise.calcium} hide={!this.state.advise.show_calcium}></FoodInfoRow>
                  <FoodInfoRow title="Żelazo" today={totalComponents.iron} advise={this.state.advise.iron} hide={!this.state.advise.show_iron}></FoodInfoRow>
                  <FoodInfoRow title="Witamina C" today={totalComponents.vitaminC} advise={this.state.advise.vitaminC} hide={!this.state.advise.show_vitaminC}></FoodInfoRow>
                  <FoodInfoRow title="Witamina A" today={totalComponents.vitaminA} advise={this.state.advise.vitaminA} hide={!this.state.advise.show_vitaminA}></FoodInfoRow>
                </div>
              </div>
            </div>
        }

        return (
            <div>
              <div className="popup-overlay"></div>
              <Route path={this.state.rootRoute  + `/dish/:dishId/:dishNum/addComponent`} component={AddComponentFirstStep}/>
              <Route path={this.state.rootRoute  + `/dish/:dishId/:dishNum/addComponent/:componentNum/quantity`} component={AddComponentSecondStep}/>
              {foodInfo}
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
                        {answerTemplates}
                    </Col>
                    <Col lg={2} md={1}></Col>                    
                </FormGroup>   

                {simpleModeCheckbox}


                {dishesProcessed.map((dish, num) => {
                    let dishComponentsInfo = '';
                    let addComponentLink = '';
                    let dishHeaderInfo = '';
                    if(!this.state.data.isSimpleDishMode){
                        dishComponentsInfo = <div>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="col-lg-3 col-md-3 col-sm-3 col-xs-3">Składniki:</label>
                                <label className="col-lg-1 col-md-1 col-sm-1 col-xs-1">Ilość</label>
                                <label className="col-lg-1 col-md-1 col-sm-1 col-xs-1">Kalorie</label>
                            </Col>
                        {dish.components.map((comp) => <Col lg={12} md={12} sm={12} xs={12} key={comp.id}>
                              <label className="col-lg-3 col-md-3 col-sm-3 col-xs-3">{comp.name}</label>
                              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">{comp.weight} g</div>
                              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">{comp.calories.toFixed(0)}</div>
                              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                <em className="fa fa-times" style={{cursor:'pointer'}} onClick={this.deleteComponent.bind(this, comp.id, num)}></em>
                              </div>
                          </Col> )}
                        </div>
                        addComponentLink = <div>
                            {this.state.userId ? "" : <Link to={this.state.rootPath  + `/dish/${dish.id}/${num+1}/addComponent`}>
                                <em className="fa fa-plus-square"></em>
                            </Link>}
                          </div>
                        dishHeaderInfo = <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <DishInfo {...dish} />
                          </label>
                    }else{
                        dishComponentsInfo = <div>
                            <Col lg={3} md={3} sm={4} xs={4}>
                              <label className="control-label">Opis posiłku:</label>
                            </Col>
                            <Col  lg={9} md={9} sm={8} xs={8}>
                                <textarea 
                                maxLength='400'
                                className="form-control" 
                                name='description' {...readonlyForTrainer}
                                value={dish.description || ''}
                                onChange={this.handleDishChange.bind(this, num)}></textarea>
                                <label className="col-lg-12 control-label">Maks. 400 znaków</label>
                            </Col>
                        </div>
                    }
                    

                    return <div key={num} className='dish-item'>                      
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
                                  onChange={this.handleDishChange.bind(this, num)}/>
                              </Col>
                              {dishHeaderInfo}                              
                          </FormGroup>
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          {addComponentLink}
                        </Col>
                      </div>
                      <div className='dish-body' style={dish.__collapsed ? {display: 'none'} : {}}>
                        {dishComponentsInfo}
                          
                        <Col lg={3} md={3} sm={4} xs={4}>
                          <label className="control-label">Uwagi i pytania do trenera:</label>
                        </Col>
                        <Col  lg={9} md={9} sm={8} xs={8}>
                            <textarea 
                            maxLength='400'
                            className="form-control" 
                            name='comment' {...readonlyForTrainer}
                            value={dish.comment || ''}
                            onChange={this.handleDishChange.bind(this, num)}></textarea>
                            <label className="col-lg-12 control-label">Maks. 400 znaków</label>
                        </Col>
                      </div>
                  </div>})
                }

                {this.state.trainings.map((training, num) => <FormGroup key={num}>
                    <div className="col-lg-12 text-bold">{`Trening ${num+1}:`}</div>
                    <Col lg={2} md={1}></Col>
                    <Col lg={2} md={2} sm={6}>
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
                    <Col lg={1} md={1} sm={3}>
                      <label className="control-label">Minuty:</label>
                    </Col>
                    <Col lg={2} md={2} sm={3}>
                        <FormControl type="number"
                        className="form-control" {...readonlyForTrainer}
                        name='length'
                        value={training.length || 0}
                        onChange={this.handleTrainingChange.bind(this, num)}/>
                    </Col>
                    <Col lg={2} md={2} sm={6}>
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

