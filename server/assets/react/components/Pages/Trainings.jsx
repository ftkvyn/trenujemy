import React from 'react';
import moment from 'moment';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { loadUser, saveUser, loadRequirements, saveRequirements, loadSurvey, loadPurchases } from '../Common/userDataService';
import { loadUserTrainings, createUserTrainings, saveComment, removeTrainings } from '../Common/trainingsService';


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
          use24hours: true,
          format:'DD.MM.YYYY hh:mm',
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

    render() {  
        let trainingsLeft = 0;
        let validToStr = null;
        if(this.state.goods.trainPlans && this.state.goods.trainPlans.length){
            for(let i = 0; i < this.state.goods.trainPlans.length; i++){
                let train = this.state.goods.trainPlans[i];
                trainingsLeft += train.trainsLeft;
                if(!validToStr){
                    validToStr = train.validToStr;
                }
            }
        }
        return (
            <Panel>
                <h2>Tutaj zarządzasz treningami z klientem</h2>
                <Well>
                    <p>Zostało treingów: <b>{trainingsLeft}</b></p>
                    <p>Termin wykorzystania: <b>{validToStr}</b></p>                    
                </Well>
                <h3>Dodaj nowy trening</h3>
                <form className="form-horizontal">                            
                    <FormGroup>
                        <label className="col-lg-1 col-md-2 col-sm-4 col-xs-6 control-label">Data:</label>
                        <Col lg={ 11 } md={10} sm={8} xs={6}>
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
                        <Col lg={ 11 } md={10} sm={8} xs={6}>
                            <FormControl type="text" placeholder="Miejsce" 
                                className="form-control"
                                name='newTrainingPlace'
                                value={this.state.newTrainingPlace}
                                onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <button type="button" onClick={this.addTraining.bind(this)} className="btn btn-primary">Dodaj</button>

                    <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                        Dane zapisane poprawnie.
                    </div>  
                    <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                        Nie udało się zapisać dane.
                    </div>

                    
                </form>
            </Panel>
        );
    }

}

export default Trainings;

