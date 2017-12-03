import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadSurvey, saveSurvey } from '../Common/userDataService';
import { saveImage, saveFile } from '../Common/filesService';

let hideAlertSuccess = null;
let hideAlertError = null;

function saveUserFn(newData){
    saveSurvey(newData)
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

function formatHour(val) {
    val = '' + val;
    val = val.replace(':','');
    if(isNaN(+val)){
        return '0000';
    }
    if(+val >= 2400){
        return '23:59';
    }
    while(val.length < 4){
        val = '0' + val;
    }
    return val;
}

function setUser(userData, me){
    $('.saveError').hide();
    $('.saveSuccess').hide();
    userData.wakeUpHour = formatHour(userData.wakeUpHour);
    userData.goToBedHour = formatHour(userData.goToBedHour);
    me.setState({data: userData},
        () =>{
            if($.fn.inputmask){
                $('[data-masked]').inputmask();
                $('[data-masked]').off('change');
                $('[data-masked]').change(me.handleChange.bind(me));
            }
        });
}

let saveHandler = null;

class Survey extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            data:{
                bodySize:{}
            }
        };
        if(this.props.match && this.props.match.params){
            initialState.userId = this.props.match.params.id;
        }
        this.state = initialState;        
    };

    componentWillReceiveProps(nextProps) {
        var nextId = undefined;
        if(nextProps.match && nextProps.match.params){
            nextId = nextProps.match.params.id;
        }
        if(this.state.userId === nextId){
            return;
        }
        let me = this;
        this.setState({userId: nextId});
        loadSurvey(nextId)
            .then((data) => setUser(data, me));
    }

    componentDidMount(){
        let me = this;
        loadSurvey(this.state.userId)
            .then((data) => setUser(data, me));        
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        let newData = this.state.data;
        if(fieldName.indexOf('isNull:') > -1){
            fieldName = fieldName.replace('isNull:','');
            if(fieldVal == 'yes'){
                newData[fieldName] = '';
            }else{
                newData[fieldName] = null;
            }
        }if(fieldName.indexOf('binmap:') > -1){
            fieldName = fieldName.replace('binmap:','');
            let checked = event.target.checked;
            if(checked){
                newData[fieldName] = newData[fieldName] | parseInt(fieldVal, 2);
            }else{
                newData[fieldName] = newData[fieldName] ^ parseInt(fieldVal, 2);
            }
        } else{
            if(typeof $(event.target).attr('data-masked') != 'undefined'){
                fieldVal = fieldVal.replace(':','');   
            }            
            if(fieldName.indexOf('.') == -1){
                newData[fieldName] = fieldVal
            }else{
                let fields = fieldName.split('.');
                newData[fields[0]][fields[1]] = fieldVal || 0;
            }
        }
        this.setState({data: newData});

        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveUserFn(newData), 1000);        
        saveHandler();
    }

    imageClick(event){
        if(this.state.userId){
            return;
        }
        $('#profilePicInput').click();
    }

    uploadImage(){
        let me = this;
        var formData = new FormData();
        var fileData = $('#bodyPicInput')[0].files[0];
        formData.append('file', fileData);
        saveImage(formData)
        .then(function(data){
            let newData = me.state.data;
            newData.bodyPicture = data.url;
            me.setState({data: newData});
            if(saveHandler){
                saveHandler.clear();
            }
            saveHandler = debounce(() => saveUserFn(newData), 100);        
            saveHandler();
        })
        .catch(function(err){
            $('.saveError').show();
            clearTimeout(hideAlertError);
            hideAlertError = setTimeout(() => {$('.saveError').hide()}, 6000);
        });
    }

    render() {  
        if(!this.state.data.id){
            return <Panel></Panel>
        }
        var readonlyProps = {};
        if(this.state.userId){
            readonlyProps = {readOnly: true, disabled: 'disabled'};
        }
        var picForm = "";
        if(!this.state.userId){
            picForm = <form id='bodyPicForm' style={{display:'none'}}>
                <input type='file' name='file' id='profilePicInput' onChange={this.uploadImage.bind(this)}/>
            </form>
        }
        return (
              <Panel>
                <form className="form-horizontal">     
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Twój główny cel:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="weight"
                                    checked={this.state.data.target === 'weight'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę zbudować masę i powiększyć mięśnie
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="cut"
                                    checked={this.state.data.target === 'cut'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę wyrzeźbić mięśnie
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="slim"
                                    checked={this.state.data.target === 'slim'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę schudnąć
                                </label>
                            </div>
                            <div className="radio c-radio">
                                <label>
                                    <input type="radio" name="target" 
                                    value="power"
                                    checked={this.state.data.target === 'power'} 
                                    onChange={this.handleChange.bind(this)} />
                                    <em className="fa fa-circle"></em>Chcę zwiększyć siłę
                                </label>
                            </div>
                        </Col>
                    </FormGroup>
                    <legend>2) Typ sylwetki</legend>
                    <div style={{'paddingLeft':'50px','paddingBottom':'20px'}}>
                        <img src='/images/body_types.jpg'/>
                        <div>
                            <label style={{'margin':'0 46px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="1"
                                checked={this.state.data.bodyType == '1'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                            <label style={{'margin':'0 46px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="2"
                                checked={this.state.data.bodyType == '2'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                            <label style={{'margin':'0 52px'}} className="radio-inline c-radio">
                                <input type="radio" name="bodyType" 
                                value="3"
                                checked={this.state.data.bodyType == '3'} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-circle"></em>
                            </label>
                        </div>
                    </div>
                    <legend>2) Osobiste zwyczaje</legend>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Godzina pobudki:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Godzina pobudki" 
                            className="form-control" {...readonlyProps}
                            data-masked="" data-inputmask="'mask': '99:99'" 
                            name='wakeUpHour'
                            value={this.state.data.wakeUpHour}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Godzina chodzenia spać:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Godzina chodzenia spać" 
                            className="form-control" {...readonlyProps}
                            data-masked="" data-inputmask="'mask': '99:99'" 
                            name='goToBedHour'
                            value={this.state.data.goToBedHour}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Przeciętna liczba posiłków dziennie:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Przeciętna liczba posiłków dziennie" 
                            className="form-control" {...readonlyProps}
                            name='mealsNumber'
                            value={this.state.data.mealsNumber}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                     <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Godziny spożywania posiłków (kolejne po przecinku):</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Godziny spożywania posiłków" 
                            className="form-control" {...readonlyProps}
                            name='eatingTimes'
                            value={this.state.data.eatingTimes}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Czy jesteś gotowy zmienić swój dzienny plan aby dostosować sie do zaleceń trenera?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="canYouChangeDailyPlan" 
                            value={this.state.data.canYouChangeDailyPlan || 'no'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='no'>Nie</option>
                                <option value='rather_no'>Raczej nie</option>
                                <option value='rather_yes'>Raczej tak</option>
                                <option value='yes'>Zdecydowanie tak</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Czy jesteś w stanie przygotowywać posiłki na cały dzień w lunch boxach?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="canYouPrepareDishes" 
                            value={this.state.data.canYouPrepareDishes || 'rather_no'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='rather_no'>Wolałbym nie</option>
                                <option value='maybe'>W umiarkowanym zakresie tak</option>
                                <option value='yes'>W 100% tak</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Czy akceptujesz, aby tego samego dnia jeść więcej niż raz ten sam posiłek?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="canYouEatSameDaily" 
                            value={this.state.data.canYouEatSameDaily || 'rather_no'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='rather_no'>Wolałbym nie</option>
                                <option value='maybe'>W umiarkowanym zakresie tak</option>
                                <option value='yes'>W 100% tak</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <label className="col-lg-3 col-md-4 control-label">Czy masz alergię na określone produkty spożywcze?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="isNull:allergy" 
                            value={this.state.data.allergy === null ? 'no' : 'yes'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            style={{'width':'80px'}}
                            className="form-control">
                                <option value='yes'>Tak</option>
                                <option value='no'>Nie</option>
                            </FormControl>

                             <FormControl type="text" placeholder="Alergie" 
                                className="form-control ml" {...readonlyProps}
                                name='allergy'
                                style={this.state.data.allergy === null ? {'display':'none'} : {}}
                                value={this.state.data.allergy || ''}
                                onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <label className="col-lg-3 col-md-4 control-label">Czy chcesz wykluczyć jakieś produkty ze swojej diety?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="isNull:notEating" 
                            value={this.state.data.notEating === null ? 'no' : 'yes'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            style={{'width':'80px'}}
                            className="form-control">
                                <option value='yes'>Tak</option>
                                <option value='no'>Nie</option>
                            </FormControl>

                             <FormControl type="text" placeholder="Wykluczyć z diety" 
                                className="form-control ml" {...readonlyProps}
                                name='notEating'
                                style={this.state.data.notEating === null ? {'display':'none'} : {}}
                                value={this.state.data.notEating || ''}
                                onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <label className="col-lg-3 col-md-4 control-label">Czy masz problemy z utrzymaniem prawidłowej wagi?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="preserveWeightProblems" 
                            value={this.state.data.preserveWeightProblems}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            style={{'width':'80px'}}
                            className="form-control">
                                <option value='true'>Tak</option>
                                <option value='false'>Nie</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <label className="col-lg-3 col-md-4 control-label">Czy stosowałeś w przeszłości plany żywieniowe? Jeżeli tak - jakie?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="isNull:usedEatingPlans" 
                            value={this.state.data.usedEatingPlans === null ? 'no' : 'yes'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            style={{'width':'80px'}}
                            className="form-control">
                                <option value='yes'>Tak</option>
                                <option value='no'>Nie</option>
                            </FormControl>

                             <FormControl type="text" placeholder="Plany żywieniowe" 
                                className="form-control ml" {...readonlyProps}
                                name='usedEatingPlans'
                                style={this.state.data.usedEatingPlans === null ? {'display':'none'} : {}}
                                value={this.state.data.usedEatingPlans || ''}
                                onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className='form-inline'>
                        <label className="col-lg-3 col-md-4 control-label">Czy jesteś w stanie powiedzieć ile średnio dziennie spożywasz kalorii?</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="isNull:dailyCalories" 
                            value={this.state.data.dailyCalories === null ? 'no' : 'yes'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            style={{'width':'80px'}}
                            className="form-control">
                                <option value='yes'>Tak</option>
                                <option value='no'>Nie</option>
                            </FormControl>

                             <FormControl type="number" placeholder="kalorii" 
                                className="form-control ml" {...readonlyProps}
                                name='dailyCalories'
                                style={this.state.data.dailyCalories === null ? {'display':'none'} : {'width':'120px'}}
                                value={this.state.data.dailyCalories || 0}
                                onChange={this.handleChange.bind(this)}/> 
                                <span style={this.state.data.dailyCalories === null ? {'display':'none'} : {}}>kcal</span>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Zaznacz które sprzęty kuchenne posiadasz:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <label className="checkbox-inline c-checkbox">
                                <input type="checkbox" name="binmap:kitchenEquipment" 
                                value="1"
                                className='needsclick'
                                checked={this.state.data.kitchenEquipment & 0b1} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-check"></em>Piekarnik
                            </label>
                            <label className="checkbox-inline c-checkbox">
                                <input type="checkbox" name="binmap:kitchenEquipment" 
                                value="10"
                                className='needsclick'
                                checked={this.state.data.kitchenEquipment & 0b10} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-check"></em>Blender
                            </label>
                            <label className="checkbox-inline c-checkbox">
                                <input type="checkbox" name="binmap:kitchenEquipment" 
                                value="100"
                                className='needsclick'
                                checked={this.state.data.kitchenEquipment & 0b100} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-check"></em>Toster
                            </label>
                            <label className="checkbox-inline c-checkbox">
                                <input type="checkbox" name="binmap:kitchenEquipment" 
                                value="1000"
                                className='needsclick'
                                checked={this.state.data.kitchenEquipment & 0b1000} 
                                onChange={this.handleChange.bind(this)} />
                                <em className="fa fa-check"></em>Grill elektryczny
                            </label>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Rodzaj wykonywanej pracy:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <textarea 
                            className="form-control" 
                            name='invoiceInfo'
                            value={this.state.data.hintsForTrainer || ''}
                            onChange={this.handleChange.bind(this)}></textarea>
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Inne uwagi dla trenera:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="text" placeholder="Rodzaj wykonywanej pracy" 
                            className="form-control" {...readonlyProps}
                            name='workType'
                            value={this.state.data.workType}
                            onChange={this.handleChange.bind(this)}/>
                        </Col>
                    </FormGroup> 
                    <legend>3) Ankieta treningowa</legend>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Waga:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Waga" 
                            className="form-control" {...readonlyProps}
                            name='weight'
                            value={this.state.data.weight}
                            onChange={this.handleChange.bind(this)}/> kg
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Wzrost:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Wzrost" 
                            className="form-control" {...readonlyProps}
                            name='height'
                            value={this.state.data.height}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup>                    
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Aktywność fizyczna ogółem:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="activity" 
                            value={this.state.data.activity || 'little'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='little'>Mała (mało ruchu na co dzień, brak treningów)</option>
                                <option value='normal'>Umiarkowana (nieco ruchu na codzień i do jednego treningu w tygodniu)</option>
                                <option value='medium'>Średnia (nieco ruchu i do dwóch treningów w tygodniu)</option>
                                <option value='many'>Duża (bardzo aktywny na codzień i do 3-4 treningów w tygodniu)</option>
                                <option value='very_much'>Bardzo duża (bardzo aktywny tryb życia i powyżej 4 treningów w tygodniu)</option>
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <h3>Aktualne wymiary</h3>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Kark:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Kark" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.neck'
                            value={this.state.data.bodySize.neck}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Ramię:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Ramię" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.shoulder'
                            value={this.state.data.bodySize.shoulder}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Przedramię:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Przedramię" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.forearm'
                            value={this.state.data.bodySize.forearm}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Nadgarstek:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Nadgarstek" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.wrist'
                            value={this.state.data.bodySize.wrist}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Klatka piersiowa:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Klatka piersiowa" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.chest'
                            value={this.state.data.bodySize.chest}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Talia (brzuch):</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Talia (brzuch)" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.waist'
                            value={this.state.data.bodySize.waist}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Biodra:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Biodra" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.hips'
                            value={this.state.data.bodySize.hips}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Udo:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Udo" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.thigh'
                            value={this.state.data.bodySize.thigh}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Łydka:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl type="number" placeholder="Łydka" 
                            className="form-control" {...readonlyProps}
                            name='bodySize.shin'
                            value={this.state.data.bodySize.shin}
                            onChange={this.handleChange.bind(this)}/> cm
                        </Col>
                    </FormGroup> 
                    <hr/>
                    <FormGroup>
                        <label className="col-lg-3 col-md-4 control-label">Doświadczenie na siłowni:</label>
                        <Col lg={ 9 } md={ 8 }>
                            <FormControl componentClass="select" name="canYouEatSameDaily" 
                            value={this.state.data.canYouEatSameDaily || 'rather_no'}
                            onChange={this.handleChange.bind(this)}
                            {...readonlyProps}
                            className="form-control">
                                <option value='rather_no'>Nigdy nie ćwiczyłem</option>
                                <option value='maybe'>W umiarkowanym zakresie tak</option>
                                <option value='yes'>W 100% tak</option>
                            </FormControl>
                        </Col>
                    </FormGroup>

                    <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                        Dane zapisane poprawnie.
                    </div>  
                    <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                        Nie udało się zapisać dane.
                    </div>
                </form>
                {picForm}
            </Panel>
        );
    }

}

export default Survey;
