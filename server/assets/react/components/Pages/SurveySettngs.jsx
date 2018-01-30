import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Well, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { loadSurveySettngs, saveSurveySettng } from '../Common/surveySettngsService';
import SurveySettingRow from '../Components/SurveySettingRow';

let saveHandler = null;
let hideAlertSuccess = null;
let hideAlertError = null;

const personalCustomsFields = [
    ['wakeUpHour','Godzina pobudki:'],
    ['goToBedHour','Godzina chodzenia spać:'],
    ['mealsNumber','Przeciętna liczba posiłków dziennie:'],
    ['eatingTimes','Godziny spożywania posiłków:'],
    ['canYouChangeDailyPlan','Czy jesteś gotowy zmienić swój dzienny plan aby dostosować sie do zaleceń trenera?'],
    ['canYouPrepareDishes','Czy jesteś w stanie przygotowywać posiłki na cały dzień w lunch boxach?'],
    ['canYouEatSameDaily','Czy akceptujesz, aby tego samego dnia jeść więcej niż raz ten sam posiłek:'],
    ['allergy','Czy masz alergię na określone produkty spożywcze:'],
    ['notEating','Czy chcesz wykluczyć jakieś produkty ze swojej diety?'],
    ['preserveWeightProblems','Czy masz problemy z utrzymaniem prawidłowej wagi?'],
    ['usedEatingPlans','Czy stosowałeś w przeszłości plany żywieniowe? Jeżeli tak - jakie?'],
    ['dailyCalories','Czy jesteś w stanie powiedzieć ile średnio dziennie spożywasz kalorii?'],
    ['kitchenEquipment','Zaznacz które sprzęty kuchenne posiadasz:'],
    ['workType','Rodzaj wykonywanej pracy:'],
    ['hintsForTrainer','Inne uwagi dla trenera:']
];

const bodySizeFields = [
['bodySize.neck','Kark:'],
['bodySize.shoulder','Ramię:'],
['bodySize.forearm','Przedramię:'],
['bodySize.wrist','Nadgarstek:'],
['bodySize.chest','Klatka piersiowa:'],
['bodySize.waist','Talia (brzuch):'],
['bodySize.hips','Biodra:'],
['bodySize.thigh','Udo:'],
['bodySize.shin','Łydka:'],
];

const trainingFields = [
['weight','Waga:'],
['height','Wzrost:'],
['activity','Aktywność fizyczna ogółem:'],
['gymExperience','Doświadczenie na siłowni:'],
['trainingsStatus','Aktualny status treningów:'],
['trainingDescription','Rozpisz, jak trenujesz obecnie na siłowni:'],
['otherTrainings','Czy oprócz siłowni uprawiasz inne sporty:'],
['currentStatus','Jak oceniasz swój obecny stan wytrenowania:'],
['possibleTrainings','Ile razu w tygodniu w nowym planie treningowym możesz maksymalnie ćwiczyć na siłowni:'],
['mostImportantBodyPart','Na której partii mięśni zależy Ci najbardziej:'],
['availableEquipment','Jaki jest Twój dostęp do sprzętów:'],
['currentNutrition','Czy obecnie stosujesz suplementy diety?'],
['supplementsCost','Czy chcesz stosować suplementację?'],
['contusionCheckboxes','Czy masz kontuzje?'],
['otherHints','Inne uwagi dla trenera'],
['bodyPicture','Zdjęcie sylwetki'],
['medicalReportName','Badanie lekarskie'],
];

function saveSettingFn(data){
    saveSurveySettng(data)
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

function loadSetting(type){
  loadSurveySettngs()
            .then((data) => {
              let setting = data.find((item) => item.settingType == type)
              this.setState({setting: setting})
            });
}

class SurveySettngs extends React.Component {
    
    constructor(props, context) {
        super(props, context);
        let initialState = {
            setting:{}
        };
        if(this.props.match && this.props.match.params){
            initialState.type = this.props.match.params.type;
        }
        this.state = initialState;        
    }

    componentWillReceiveProps(nextProps) {
        var nextType = undefined;
        if(nextProps.match && nextProps.match.params){
            nextType = nextProps.match.params.type;
        }
        if(this.state.type === nextType){
            return;
        }
        this.setState({type: nextType});
        loadSetting.call(this, nextType);
    }

    componentDidMount(){
        loadSetting.call(this, this.state.type);
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.checked;
        const setting = this.state.setting;
        let includedFields = setting.includedFields;
        if(fieldVal){          
          let newItems = [          
            ...includedFields,            
            fieldName
          ];
          setting.includedFields = newItems;
        }else{
          let newItems = includedFields.filter( (item) => item != fieldName);
          setting.includedFields = newItems;
        }
        console.log(fieldName);
        console.log(setting.includedFields);
        
        
        this.setState({setting: setting});
        if(saveHandler){
            saveHandler.clear();
        }
        saveHandler = debounce(() => saveSurveySettng(setting), 500);        
        saveHandler();
    }

    render() {  
        if(!this.state.setting.includedFields){
          return <div></div>
        }
        let caption = '', description = '';
        if(this.state.type == 'training'){
          caption = 'Ankieta treningowa';
          description = 'Tutaj określasz jaką ankietę wypełni klient który wykupi u Ciebie treningi';
        }else if(this.state.type == 'feed'){
          caption = 'Ankieta - plan żywieniowy';
          description = 'Tutaj określasz jaką ankietę wypełni klient który wykupi u Ciebie plan żywieniowo - treningowy';
        }
        return (
            <ContentWrapper>
                <h3>{caption}</h3>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                        <Well bsSize="large" style={{'textAlign':'center'}}>
                            <h1><em className="fa fa-cogs"></em></h1>
                            <p>{description}</p>
                        </Well>
                        <Panel>
                          <form className="form-horizontal" style={{ paddingLeft: '20px'}}>   
                              <legend>1) Typ sylwetki</legend>
                              <SurveySettingRow label="Typ sylwetki:" name='bodyType'
                                  items={this.state.setting.includedFields} 
                                  onChange={this.handleChange.bind(this)}></SurveySettingRow>
                              <legend>2) Osobiste zwyczaje</legend>
                              {personalCustomsFields.map( (fields, num) => <SurveySettingRow 
                                  key={num}
                                  label={fields[1]} name={fields[0]}
                                  items={this.state.setting.includedFields} 
                                  onChange={this.handleChange.bind(this)}></SurveySettingRow>)}
                              <legend>3) Ankieta treningowa</legend>
                              {trainingFields.map( (fields, num) => <SurveySettingRow 
                                  key={num}
                                  label={fields[1]} name={fields[0]}
                                  items={this.state.setting.includedFields} 
                                  onChange={this.handleChange.bind(this)}></SurveySettingRow>)}
                              <h5>Aktualne wymiary</h5>
                              <div className='actual-sizes-box'>
                              {bodySizeFields.map( (fields, num) => <SurveySettingRow 
                                  key={num}
                                  label={fields[1]} name={fields[0]}
                                  items={this.state.setting.includedFields} 
                                  onChange={this.handleChange.bind(this)}></SurveySettingRow>)}
                              </div>
                          </form>
                        </Panel>
                  </Col>
                </Row>
                <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                    Dane zapisane poprawnie.
                </div>  
                <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                    Nie udało się zapisać dane.
                </div>
            </ContentWrapper>
        );
    }

}

export default SurveySettngs;

