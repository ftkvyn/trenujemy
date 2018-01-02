import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadComponents, addComponent } from '../Common/dishService'
import { getDayByStr } from '../Common/diaryService'

class AddComponentSecondStep extends React.Component {
    constructor(props, context) {
        super(props, context);
        const rootPath = this.props.location.pathname;
        const index = rootPath.indexOf('/addComponent/');
        const backPath = rootPath.substring(0, index + '/addComponent'.length);
        const indexDiary = rootPath.indexOf('/dish/');
        const diaryPath = rootPath.substring(0, indexDiary);
        let initialState = {
            rootPath: rootPath,
            backPath: backPath,
            diaryPath: diaryPath,
            allComponents: [],
            selectedComponent: {},
            gramms:[10,50,100,200],
            weight: "",
            adding: false,
        };
        this.state = initialState; 
    };

    componentDidMount(){
        loadComponents()
          .then((data) => {
              const selectedItem = data.find((item) => item.num == this.props.match.params.componentNum);
              this.setState({allComponents: data, selectedComponent: selectedItem});  
          });
    }

    componentWillMount(){
      document.body.className += ' ' + 'with-second-popup';      
    }

    componentWillUnmount(){
      document.body.className = document.body.className.replace("with-second-popup","");
    }

    handleWeightChange(event){
      const value = event.target.value;
      this.setState({weight: value});
    }

    setGramms(value){
      if(!value || this.state.adding){
        return;
      }
      this.setState({adding: true});
      let dayIndex = this.state.rootPath.indexOf('/diary/') + '/diary/'.length;
      let dayStr = this.state.rootPath.substring(dayIndex, dayIndex + '00-00-0000'.length);
      let dayId = getDayByStr(dayStr).id;
      let model = {};
      model.dish = this.props.match.params.dishId;
      model.name = this.state.selectedComponent.name;
      model.weight = value;
      model.num = this.props.match.params.componentNum;
      addComponent(dayId, model)
        .then(function(){
            this.setState({adding: false});
            this.props.history.push(this.state.diaryPath);
        }.call(this))
        .catch(function(err){
            this.setState({adding: false});
        }.call(this));
    }

    render() {  
        return (
            <div className='dish-popup'>
                <h3>
                    <Link to={this.state.backPath}>
                      <em className="fa fa-arrow-circle-o-left mr"></em>
                    </Link>
                    {"Dodaj składnik: Posiłek " + this.props.match.params.dishNum}
                </h3>
                <h4 className="text-center">{this.state.selectedComponent.name}</h4>
                <hr/>
                <Row className='dish-components-list text-left mt'>
                  {this.state.gramms.map((value => <Col lg={12} md={12} sm={12} key={value}>
                    <a style={{'cursor':'pointer'}}>
                      <em className="fa fa-plus-circle mr" onClick={this.setGramms.bind(this, value)}></em>
                    </a>
                    <span>{value} g</span> 
                  </Col>))}    
                  <Col lg={12} md={12} sm={12}>
                    <a style={{'cursor':'pointer'}}>
                      <em className="fa fa-plus-circle mr" onClick={this.setGramms.bind(this, this.state.weight)}></em>
                    </a>
                    <FormControl type="number"
                        className="form-control short-input"
                        name='weight'
                        style={{fontSize:'100%'}}
                        value={this.state.weight || ''}
                        onChange={this.handleWeightChange.bind(this)}/> g
                  </Col>                     
                </Row>
            </div>
        );
    }

}

export default withRouter(AddComponentSecondStep);
