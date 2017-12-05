import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadPlaces, savePlace, deletePlace } from '../Common/trainPlacesService';

class TrainingsPlaces extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            places:[],
            newPlace:{
              name: '',
              type: 'gym'
            }
        };
        this.state = initialState;        
    }

    componentDidMount(){
        let me = this;
        loadPlaces()
            .then((data) => me.setState({places: data}));
    }


    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newPlace = this.state.newPlace;
        newPlace[fieldName] = fieldVal
        this.setState({newPlace: newPlace});
    }

    addPlace(){
      let me = this;
      if(me.state.newPlace.name == ''){
        return;
      }
      savePlace(me.state.newPlace)
            .then((data) => {
              const newPlaces = [...me.state.places, data];
              const newPlace = {name: '', type: 'gym'};
              me.setState({places: newPlaces, newPlace: newPlace});
            });
    }

    deletePlace(placeId){
      if(!confirm('”Czy na pewno chcesz usunąć to miejsce treningu?')){
        return;
      }
      let me = this;
      deletePlace(placeId)
            .then(() => {
              const newPlaces = me.state.places.filter((place) => place.id != placeId);
              me.setState({places: newPlaces});
            });
    }

    render() {  
        return (
            <ContentWrapper>
                <h3>Miejsca treningów</h3>
                <Row>
                      {this.state.places.map((place) => <Col key={place.id} lg={3} md={4} sm={6} xs={12}>
                        <div className="panel widget">
                         <div className="row row-table row-flush">
                            <div className={"col-xs-4 text-center " + (place.type == 'gym' ? 'bg-info' : 'bg-green')}>
                               <em className={(place.type == 'gym' ? 'icon-home' : 'fa-tree fa fa-2x')}></em>
                            </div>
                            <div className="col-xs-8">
                               <div className="panel-body text-center">
                                  <h4 className="mt0">{place.name}</h4>
                                  <p className="mb0 text-muted">{place.type == 'gym' ? 'Siłownia' : 'Plener'}</p>
                                  <div onClick={this.deletePlace.bind(this, place.id)} className='btn btn-default'>
                                    <em className="fa fa-trash"></em>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    </Col>)}
                </Row>
                <Row>
                  <Col lg={12} md={12}>
                    <form className="form-horizontal">     
                        <FormGroup>
                            <label className="col-lg-2 control-label">Nazwa:</label>
                            <Col lg={ 10 }>
                                <FormControl type="text" placeholder="Nazwa" 
                                className="form-control"
                                name='name'
                                value={this.state.newPlace.name}
                                onChange={this.handleChange.bind(this)}/>
                            </Col>
                        </FormGroup> 
                        <FormGroup>
                          <label className="col-lg-2 col-md-4 control-label">Typ:</label>
                          <Col lg={ 10 } md={ 8 }>
                              <div className="radio c-radio">
                                  <label>
                                      <input type="radio" name="type" 
                                      value="gym"
                                      checked={this.state.newPlace.type === 'gym'} 
                                      onChange={this.handleChange.bind(this)} />
                                      <em className="fa fa-home"></em> 
                                      Siłownia
                                  </label>
                              </div>
                              <div className="radio c-radio">
                                  <label>
                                      <input type="radio" name="type" 
                                      value="openair"
                                      checked={this.state.newPlace.type === 'openair'} 
                                      onChange={this.handleChange.bind(this)} />
                                      <em className="fa fa-tree"></em>
                                      Plener
                                  </label>
                              </div>
                          </Col>
                        </FormGroup>
                         <FormGroup>
                            <label className="col-lg-2 control-label"></label>
                            <Col lg={ 10 }>
                              <div className='btn btn-primary' onClick={this.addPlace.bind(this)}>Dodaj</div>
                            </Col>
                        </FormGroup> 
                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                            Dane zapisane poprawnie.
                        </div>  
                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                            Nie udało się zapisać dane.
                        </div>
                    </form>
                  </Col>
                </Row>
            </ContentWrapper>
        );
    }

}

export default TrainingsPlaces;

