import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadComponents } from '../Common/dishService'

class AddComponentFirstStep extends React.Component {
    constructor(props, context) {
        super(props, context);
        const rootPath = this.props.location.pathname;
        const index = rootPath.indexOf('/dish/');
        const backPath = rootPath.substring(0, index);
        let initialState = {
            rootPath: rootPath,
            backPath: backPath,
            allComponents: [],
            filteredComponents: [],
            filterText: ""
        };
        this.state = initialState; 
    };

    componentDidMount(){
        loadComponents()
          .then((data) => this.setState({allComponents: data, filteredComponents: data, filterText: ""}));        
    }

    componentWillMount(){
      document.body.className += ' ' + 'with-popup';      
    }

    componentWillUnmount(){
      document.body.className = document.body.className.replace("with-popup","");
    }

    searchComponent(event){
      const newSearchText = event.target.value;
      const filterText = newSearchText.toLowerCase();
      const filteredComponents = this.state.allComponents.filter((item) => item.name.toLowerCase().indexOf(filterText) > -1);
      this.setState({filteredComponents: filteredComponents, filterText: newSearchText});
    }

    render() {  
        return (
            <div className='dish-popup dish-popup-first'>
                <h3>
                    <Link to={this.state.backPath}>
                      <em className="fa fa-arrow-circle-o-left mr"></em>
                    </Link>
                    {"Dodaj składnik: Posiłek " + this.props.match.params.dishNum}
                </h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                      <Well bsSize="large" style={{'textAlign':'center'}}>
                          <InputGroup>
                            <InputGroup.Addon><em className="fa fa-search"></em></InputGroup.Addon>
                            <FormControl type="text" placeholder="Wyszukaj składnik" 
                            name='search'
                            value={this.state.filterText}
                            onChange={this.searchComponent.bind(this)}/>
                          </InputGroup>
                          <Row className='dish-components-list text-left mt'>
                            {this.state.filteredComponents.slice(0,15).map((comp => <Col lg={12} md={12} sm={12} key={comp.num}>
                              <Link to={this.state.rootPath + `/${comp.num}/quantity`}>
                                  <em className="fa fa-plus-circle mr"></em>
                              </Link>   
                              <span>{comp.name}</span> 
                            </Col>))}                          
                          </Row>
                      </Well>
                   </Col>
                </Row>
            </div>
        );
    }

}

export default withRouter(AddComponentFirstStep);
