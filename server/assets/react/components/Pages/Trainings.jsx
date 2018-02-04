import React from 'react';
import moment from 'moment';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadUser, saveUser, loadRequirements, saveRequirements, loadSurvey, loadPurchases } from '../Common/userDataService';
import { loadUserTrainings, createUserTrainings, saveTrainingComment, removeTrainings } from '../Common/trainingsService';


let hideAlertSuccess = null;
let hideAlertError = null;
moment.locale('pl',{
    weekdays: ['Niedziela', 'Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota']
});
let saveHandlers = [];

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

class Trainings extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            goods:{},
            trainings:[],
            newTrainingPlace: ''
        };
        initialState.newTrainingDate = new Date();
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
        }
        this.state = initialState;        
    };

    componentDidMount(){
        loadPurchases(this.state.userId)
            .then((data) => this.setState({goods: data}));
        loadUserTrainings(this.state.userId)
            .then((data) => this.setState({trainings: data}));

        let now = new Date();
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
          //use24hours: true,
          format:'DD.MM.YYYY HH:mm',
          keepOpen: false,
          defaultDate: now
        });
        $("#datetimepicker").on("dp.change",  (e) => {
            let newDate = e.date.toDate();
            this.setState({newTrainingDate: newDate});
        });    
    }

    addTraining(){
        if(!this.state.newTrainingPlace || !this.state.newTrainingDate){
            return;
        }
        let model = {
            user: this.state.userId,
            place: this.state.newTrainingPlace,
            date: this.state.newTrainingDate
        };
        createUserTrainings(model)
            .then(data => {
                let trainings = this.state.trainings;
                trainings = [data, ...trainings];
                let goods = this.state.goods;
                let plan = goods.trainPlans.find(pl => pl.trainsLeft > 0);
                plan.trainsLeft--;

                this.setState({trainings: trainings, goods: goods, newTrainingPlace: ''});

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

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newState = {};
        newState[fieldName] = fieldVal
        this.setState(newState);
    }

    handleTrainingCommentChange(id,event){
        let num = this.state.trainings.findIndex(tr => tr.id == id);
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

        
        if(saveHandlers[num]){
            saveHandlers[num].clear();
        }
        saveHandlers[num] = debounce(() => {
          saveTrainingComment(newData.id, fieldVal)
            .then((saved) => {
                $('.saveError').hide();
                $('.saveSuccess').show();
                clearTimeout(hideAlertSuccess);
                hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
            })
            .catch(function(ex){
                console.error(ex);
                $('.saveSuccess').hide();
                $('.saveError').show();
                clearTimeout(hideAlertError);
                hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
            });
        }, 1000);        
        saveHandlers[num]();
    }

    collapseTraining(id){
        let num = this.state.trainings.findIndex(tr => tr.id == id);
        let newData = this.state.trainings[num];
        newData.__collapsed = !newData.__collapsed;
        let trainings = [
          ...this.state.trainings.slice(0, num),
          newData,
          ...this.state.trainings.slice(num+1)
        ];
        this.setState({trainings: trainings});
    }

    remove(id){
        let num = this.state.trainings.findIndex(tr => tr.id == id);
        let data = this.state.trainings[num];
        removeTrainings(data.id)
        .then( data => {
            let goods = this.state.goods;
            let plan = goods.trainPlans[0];
            plan.trainsLeft++;

            let trainings = [
              ...this.state.trainings.slice(0, num),
              ...this.state.trainings.slice(num+1)
            ];
            this.setState({trainings: trainings, goods: goods});

            $('.saveError').hide();
            $('.saveSuccess').show();
            clearTimeout(hideAlertSuccess);
            hideAlertSuccess = setTimeout(() => {$('.saveSuccess').hide()}, 6000);
        })
        .catch(function(ex){
            console.error(ex);
            $('.saveSuccess').hide();
            $('.saveError').show();
            clearTimeout(hideAlertError);
            hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
        });
        
    }

    render() {  
        let trainingsLeft = 0;
        let validToStr = null;
        let now = new Date();
        let futureTrainings = this.state.trainings.filter( tr => new Date(tr.date) >= now)
            .sort( (a, b) => +new Date(b.date) - +new Date(a.date));
        let pastTrainings = this.state.trainings.filter( tr => new Date(tr.date) < now)
            .map(tr => {
                if(!tr.hasOwnProperty('__collapsed')){
                    tr.__collapsed = true;
                }
                return tr;
            })
            .sort( (a, b) => +new Date(b.date) - +new Date(a.date));
        let readonlyForTrainer = {};
        let readonlyForUser = {};
        if(this.state.userId){
          readonlyForTrainer = {readOnly: true};
        }else{
          readonlyForUser = {readOnly: true};
        }
        if(this.state.goods.trainPlans && this.state.goods.trainPlans.length){
            for(let i = 0; i < this.state.goods.trainPlans.length; i++){
                let train = this.state.goods.trainPlans[i];
                trainingsLeft += train.trainsLeft;
                if(!validToStr){
                    validToStr = train.validToStr;
                }
            }
        }
        let addForm = '';
        let headerText = '';
        if(this.state.userId){
            addForm = <form className="form-horizontal">   
                <h3>Dodaj nowy trening</h3>                         
                <FormGroup>
                    <label className="col-lg-1 col-md-2 col-sm-4 col-xs-6 control-label">Data:</label>
                    <Col lg={ 5 } md={5} sm={8} xs={6}>
                        <div id="datetimepicker" className="input-group date">
                            <input type="text" className="form-control" name='newTrainingDate'/>
                            <span className="input-group-addon">
                            <span className="fa fa-calendar"></span>
                            </span>
                        </div>
                    </Col>
                </FormGroup> 
                <FormGroup>
                    <label className="col-lg-1 col-md-2 col-sm-4 col-xs-6 control-label">Miejsce:</label>
                    <Col lg={ 5 } md={5} sm={8} xs={6}>
                        <FormControl type="text" placeholder="Miejsce" 
                            className="form-control"
                            name='newTrainingPlace'
                            value={this.state.newTrainingPlace}
                            onChange={this.handleChange.bind(this)}/>
                    </Col>
                </FormGroup> 
                <FormGroup>
                    <div className="col-lg-1 col-md-2 col-sm-4 col-xs-6">
                        <button type="button" onClick={this.addTraining.bind(this)} className="btn btn-primary pull-right">Dodaj</button>
                    </div>
                </FormGroup> 
            </form>
            headerText = <h2>Tutaj zarządzasz treningami z klientem</h2>
        }
        return (
            <Panel>
                {headerText}
                <Well>
                    <p>Zostało treingów: <b>{trainingsLeft}</b></p>
                    <p>Termin wykorzystania: <b>{validToStr}</b></p>                    
                </Well>                
                {addForm}
                <form className="form-horizontal"> 

                    <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                        Dane zapisane poprawnie.
                    </div>  
                    <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                        Nie udało się zapisać dane.
                    </div>

                </form>

                {futureTrainings.length > 0 ? <h3>Treningi zaplanowane</h3> : ''}
                {futureTrainings.map((training, num) => <div key={num} className='dish-item'>                      
                      <div className='dish-header'>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            <em className="fa fa-arrow-circle-o-down" 
                              style={!training.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseTraining.bind(this, training.id)}></em>
                            <em className="fa fa-arrow-circle-o-up" 
                              style={training.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseTraining.bind(this, training.id)}></em>
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={8} xs={8}>
                          <FormGroup className='form-inline'>                  
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  {moment(training.date).format('dddd DD-MM-YYYY HH:mm')}
                              </Col>
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  {training.place}
                              </Col>
                          </FormGroup>
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            {this.state.userId ? <em onClick={this.remove.bind(this, training.id)} className="fa fa-trash pointer"></em> : ""}
                          </div>
                        </Col>
                      </div>
                      <div className='dish-body' style={training.__collapsed ? {display: 'none'} : {padding: '20px'}}>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                              {this.state.userId ? 
                                <label className="control-label">Twój komentarz:</label> : 
                                <label className="control-label">Komentarz trenera:</label>}                          
                            </Col>
                            <Col lg={6} md={8} sm={12} xs={12}>
                                <textarea 
                                maxLength='800'
                                className="form-control" 
                                name='trainerComment' {...readonlyForUser}
                                value={training.trainerComment || ''}
                                onChange={this.handleTrainingCommentChange.bind(this, training.id)}></textarea>
                                <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                              {this.state.userId ? 
                                <label className="control-label">Komentarz klienta:</label> : 
                                <label className="control-label">Twój komentarz:</label>}                          
                            </Col>
                            <Col lg={6} md={8} sm={12} xs={12}>
                                <textarea 
                                maxLength='800'
                                className="form-control" 
                                name='userComment' {...readonlyForTrainer}
                                value={training.userComment || ''}
                                onChange={this.handleTrainingCommentChange.bind(this, training.id)}></textarea>
                                <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                            </Col>
                        </Row>
                      </div>
                  </div>)}

                {pastTrainings.length > 0 ? <h3>Treningi wykonane</h3> : ''}
                {pastTrainings.map((training, num) => <div key={num} className='dish-item'>                      
                      <div className='dish-header'>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            <em className="fa fa-arrow-circle-o-down" 
                              style={!training.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseTraining.bind(this, training.id)}></em>
                            <em className="fa fa-arrow-circle-o-up" 
                              style={training.__collapsed ? {display: 'none'} : {}}
                              onClick={this.collapseTraining.bind(this, training.id)}></em>
                          </div>
                        </Col>
                        <Col lg={10} md={10} sm={8} xs={8}>
                          <FormGroup className='form-inline'>                  
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  {moment(training.date).format('dddd DD-MM-YYYY HH:mm')}
                              </Col>
                              <Col lg={ 6 } md={ 6 } sm={6} xs={6}>
                                  {training.place}
                              </Col>
                          </FormGroup>
                        </Col>
                        <Col lg={1} md={1} sm={2} xs={2}>
                          <div>
                            {this.state.userId ? <em onClick={this.remove.bind(this, training.id)} className="fa fa-trash pointer"></em> : ""}
                          </div>
                        </Col>
                      </div>
                      <div className='dish-body' style={training.__collapsed ? {display: 'none'} : {padding: '20px'}}>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                              {this.state.userId ? 
                                <label className="control-label">Twój komentarz:</label> : 
                                <label className="control-label">Komentarz trenera:</label>}                          
                            </Col>
                            <Col lg={6} md={8} sm={12} xs={12}>
                                <textarea 
                                maxLength='800'
                                className="form-control" 
                                name='trainerComment' {...readonlyForUser}
                                value={training.trainerComment || ''}
                                onChange={this.handleTrainingCommentChange.bind(this, training.id)}></textarea>
                                <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} sm={12} xs={12}>
                              {this.state.userId ? 
                                <label className="control-label">Komentarz klienta:</label> : 
                                <label className="control-label">Twój komentarz:</label>}                          
                            </Col>
                            <Col lg={6} md={8} sm={12} xs={12}>
                                <textarea 
                                maxLength='800'
                                className="form-control" 
                                name='userComment' {...readonlyForTrainer}
                                value={training.userComment || ''}
                                onChange={this.handleTrainingCommentChange.bind(this, training.id)}></textarea>
                                <label className="col-lg-12 control-label text-right">Maks. 800 znaków</label>
                            </Col>
                        </Row>
                      </div>
                  </div>)}
            </Panel>
        );
    }

}

export default Trainings;

