import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import moment from 'moment';
import DiaryDay from './DiaryDay'
import { getDayTypes, addUpdateTrainingHandler, removeUpdateTrainingHandler } from '../Common/diaryService'
import { addNotificationsListener, removeNotificationsListener, loadNotifications } from '../Common/notificationsService';
import Notification from '../Components/Notification'

function destroyDp(){
    if($('#datetimepicker').data("DateTimePicker")) {
        $('#datetimepicker').data("DateTimePicker").destroy();
        $('#datetimepicker input').val(null);
        $('#datetimepicker').off('dp.change');
        $('#datetimepicker *').off('dp.change');
    }
}

function setDatepicker(){
    destroyDp();
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
      defaultDate: new Date()
    });
    $("#datetimepicker").on("dp.change",  (e) => {
        let newDate = getDateString(e.date);
        if(newDate){
          this.props.history.push(this.state.diaryRoot + '/' + newDate);
        }
    });        
}

function getDateString(date){
  return moment(date).format('DD-MM-YYYY');
}

function updateDayTypes(){
  let days = [this.state.dates.beforeyesterday, this.state.dates.yesterday, this.state.dates.today, this.state.dates.tomorow];
  getDayTypes(days, this.state.userId)
    .then((daysInfo) => {
      let dateTypes = {};
      dateTypes.beforeyesterday = daysInfo[0].type;
      dateTypes.yesterday = daysInfo[1].type;
      dateTypes.today = daysInfo[2].type;
      dateTypes.tomorow = daysInfo[3].type;
      this.setState({dateTypes: dateTypes});
    });
}

const weekDays = ['nie', 'pon','wt','śr','czw','pią','sob'];

function getWeekDay(dateStr){
  let dayNum = moment(dateStr, 'DD-MM-YYYY').day();
  return weekDays[dayNum];
}

class Diary extends React.Component {

    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{
                bodySize:{},
            },
            dates:{},
            dateTypes:{},
            customDate:'',
            notifications:{
                diaryDays: []
            },
            listenerKey: null
        };
        initialState.dates.beforeyesterday = getDateString(moment().add(-2, 'days'));
        initialState.dates.yesterday = getDateString(moment().add(-1, 'days'));
        initialState.dates.today = getDateString(moment());
        initialState.dates.tomorow = getDateString(moment().add(1, 'days'));
        initialState.updateHandlerToken = addUpdateTrainingHandler(updateDayTypes.bind(this));
        if(this.props.match && this.props.match.params && this.props.match.params.id){
            initialState.userId = this.props.match.params.id;
            initialState.diaryRoot = `/clients/${initialState.userId}/diary`;
            initialState.diaryRootRoute = `/clients/:id/diary`;            
        }else{
            initialState.diaryRoot = this.props.diaryRoot;
            initialState.diaryRootRoute = this.props.diaryRoot;
        }
        if(this.isCustomDate(this.props.match.params.day, initialState)){
          initialState.customDate = this.props.match.params.day;
        }
        this.state = initialState; 
        if(!this.props.match.params.day){
          this.props.history.push(initialState.diaryRoot + '/' + initialState.dates.today);
        }
    }

    componentWillUnmount(){
      removeUpdateTrainingHandler(this.state.updateHandlerToken);
    }

    componentDidMount(){
        setTimeout(setDatepicker.call(this));          
        updateDayTypes.call(this);
        if(!this.state.userId){
          loadNotifications()
          .then(data => {     
              let model = Object.assign({}, this.state.notifications);  
              if(data.diaryDays){
                model.diaryDays = data.diaryDays;
              }       
              this.setState({notifications: model});
          });

          let key = addNotificationsListener( newData => {
              let oldData = this.state.notifications;
              let updatedData = Object.assign(oldData, newData);
              this.setState({notifications: updatedData});
          });
          this.setState({listenerKey: key});
        }
    }

    componentWillUnmount(){
        destroyDp();
        removeNotificationsListener(this.state.listenerKey);
    }

    componentWillReceiveProps(nextProps) {
      if(!nextProps.match.params.day){
        this.props.history.push(this.state.diaryRoot + '/' + this.state.dates.today);
      }   
      setTimeout(() => {
        if(this.isCustomDate(nextProps.match.params.day)){
          this.setState({customDate: nextProps.match.params.day});
        }else{
          this.setState({customDate: ''});
        }
        if(this.props.match.params.day != nextProps.match.params.day){
          $('#datetimepicker').data("DateTimePicker").hide();
        }
      });
    }

    routeActive(paths) {
        paths = Array.isArray(paths) ? paths : [paths];
        let currentPath = this.props.location.pathname;
        for (var i = paths.length - 1; i >= 0; i--) {
            if(currentPath.indexOf(paths[i]) > -1){
                return true;
            }
        }
        return false;
    }

    isCustomDate(day, initialState = this.state) {
        if(day != initialState.dates.today && day != initialState.dates.yesterday && day != initialState.dates.tomorow
         && day != initialState.dates.beforeyesterday){
          return true;
        }
        return false;
    }
    
    render() {  
        let calendarNotificationDays = this.state.notifications.diaryDays
          .filter( notifyDay => {
            this.state.dates.beforeyesterday != notifyDay &&
            this.state.dates.yesterday != notifyDay &&
            this.state.dates.today != notifyDay &&
            this.state.dates.tomorow != notifyDay;
          });
        return (
          <div>
            <h3>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.beforeyesterday}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.beforeyesterday) ? 'btn-primary' : 'btn-default') }>
                  Przedwczoraj (<span>{getWeekDay(this.state.dates.beforeyesterday)}</span>)
                  <div className='day-icon'>
                    <img src={"/images/icons/" + (this.state.dateTypes.beforeyesterday || "empty") + ".png"}/>
                  </div>
                  <Notification count={this.state.notifications.diaryDays.some( notifyDay => notifyDay == this.state.dates.beforeyesterday) ? 1 : 0}></Notification>
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.yesterday}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.yesterday) ? 'btn-primary' : 'btn-default') }>
                  Wczoraj (<span>{getWeekDay(this.state.dates.yesterday)}</span>)
                  <div className='day-icon'>
                    <img src={"/images/icons/" + (this.state.dateTypes.yesterday || "empty") + ".png"}/>
                  </div>
                  <Notification count={this.state.notifications.diaryDays.some( notifyDay => notifyDay == this.state.dates.yesterday) ? 1 : 0}></Notification>
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.today}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.today) ? 'btn-primary' : 'btn-default') }>
                  Dzisiaj (<span>{getWeekDay(this.state.dates.today)}</span>)
                  <div className='day-icon'>
                    <img src={"/images/icons/" + (this.state.dateTypes.today || "empty") + ".png"}/>
                  </div>
                  <Notification count={this.state.notifications.diaryDays.some( notifyDay => notifyDay == this.state.dates.today) ? 1 : 0}></Notification>
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.tomorow}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.tomorow) ? 'btn-primary' : 'btn-default') }>
                  Jutro (<span>{getWeekDay(this.state.dates.tomorow)}</span>)
                  <div className='day-icon'>
                    <img src={"/images/icons/question.png"}/>
                  </div>
                  <Notification count={this.state.notifications.diaryDays.some( notifyDay => notifyDay == this.state.dates.tomorow) ? 1 : 0}></Notification>
                </button>  
              </Link>              
              <a>
                <button type="button" 
        className={"mb-sm mr-sm btn select-date-btn btn-outline " + (this.isCustomDate(this.props.match.params.day) ? 'btn-primary' : 'btn-default') }>
                  <span>{this.state.customDate}</span>
                  <div id="datetimepicker" className="input-group date">
                      <input type="text" name='selectedDate' className='date-input'/>
                      <span className="input-group-addon">
                        <span className="fa fa-calendar"></span>
                      </span>                      
                  </div>
                  <Notification title={calendarNotificationDays.join(', ')} count={calendarNotificationDays.length}></Notification>
                </button>  
              </a>
            </h3>


            <Panel>
                <Route path={this.state.diaryRootRoute  + "/:day/"} component={DiaryDay}/>
            </Panel>
        </div>
        );
    }

}

export default withRouter(Diary);

