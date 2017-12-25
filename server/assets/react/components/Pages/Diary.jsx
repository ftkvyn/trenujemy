import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import moment from 'moment';
import DiaryDay from './DiaryDay'


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
            customDate:''
        };
        initialState.dates.beforeyesterday = getDateString(moment().add(-2, 'days'));
        initialState.dates.yesterday = getDateString(moment().add(-1, 'days'));
        initialState.dates.today = getDateString(moment());
        initialState.dates.tomorow = getDateString(moment().add(1, 'days'));
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

    componentDidMount(){
        setTimeout(setDatepicker.call(this));        
    }

    componentWillUnmount(){
        destroyDp();
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
            if(currentPath == paths[i]){
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
        if(!this.props.match.params.day){

        }
        return (
          <div>
            <h3>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.beforeyesterday}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.beforeyesterday) ? 'btn-primary' : 'btn-default') }>
                  Przedwczoraj (<span>{getWeekDay(this.state.dates.beforeyesterday)}</span>)
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.yesterday}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.yesterday) ? 'btn-primary' : 'btn-default') }>
                  Wczoraj (<span>{getWeekDay(this.state.dates.yesterday)}</span>)
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.today}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.today) ? 'btn-primary' : 'btn-default') }>
                  Dzisiaj (<span>{getWeekDay(this.state.dates.today)}</span>)
                </button>  
              </Link>
              <Link to={this.state.diaryRoot + "/" + this.state.dates.tomorow}>
                <button type="button" 
        className={"mb-sm mr-sm btn btn-outline " + (this.routeActive(this.state.diaryRoot + "/" + this.state.dates.tomorow) ? 'btn-primary' : 'btn-default') }>
                  Jutro (<span>{getWeekDay(this.state.dates.tomorow)}</span>)
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

