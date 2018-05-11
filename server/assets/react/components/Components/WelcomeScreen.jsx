import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { BrowserRouter, withRouter, Switch, Route, Redirect, Miss, Link } from 'react-router-dom';
import { loadNotifications, saveNotifications  } from '../Common/notificationsService';

class WelcomeScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        // console.log(props);
        let initialState = {
          visible: true,
          dontRemind: false,
          notifications: {},
          role: props.role
        };
        this.state = initialState; 
    };

    componentDidMount(){        
        loadNotifications()
            .then((data) => this.setState({notifications: data}));
    }

    componentWillMount(){
      document.body.className += ' ' + 'with-popup';      
    }

    componentWillUnmount(){
      document.body.className = document.body.className.replace("with-popup","");
    }

    handleNotificationsCheckbox(event){
        let newValue = !this.state.dontRemind;
        this.setState({dontRemind: newValue});
        let model = Object.assign({}, this.state.notifications);
        model.helloMessage = !newValue;
        saveNotifications(model);
    }

    close(event){
      document.body.className = document.body.className.replace("with-popup","");
      this.setState({visible: false});
    }

    render() {  
        if(!this.state.visible){
          return null;
        }
        let headerText = '';
        let headers = [];
        let texts = [];
        if(this.state.role == 'trainer'){
          headerText = "Witaj w panelu trenera,";
          headers = ['Uzupełnij swoje dane', 'Stwórz swoją stronę', 'Rozpocznij sprzedaż usług'];
          texts = [<p>W zakładce Konto > Moje dane wypełnij wszystkie pola dotyczące Twoich danych osobowych.<br/>Będą nam one potrzebne, aby w przyszłości kontaktować się z Tobą.</p>,
          <p>W zakładce Konto > Moja strona wypełnij pola które pokażą się na Twojej stronie osobistej.<br/>Kiedy uważasz, że strona jest gotowa, przekaż do akceptacji moderatora.</p>,
          <p>W momencie, kiedy strona zostanie zaakceptowana, będzie dostępna w serwisie. <br/>Od tego momentu będziesz mógł aktywnie sprzedawać swoje usługi. Powodzenia!</p>];
        }else{
          if(!this.props.goods || (!this.props.goods.feedPlan && !this.props.goods.trainPlans))
          {
              headerText = "Witaj w panelu klienta";
              headers = [<p><b>1</b><br/>Dane i ankieta</p>, 
              <p><b>2</b><br/>Zakup usługi</p>, 
              <p><b>3</b><br/>Bieżąca współpraca</p>];
              texts = [<p>Uzupełnij informacje w zakładce "Moje dane" i wypełnij formularz w zakładce "Ankieta". <br/>Możesz już zacząć korzystać z Dziennika Aktywności, uzupełniając tam na bieżąco swoje codziennie posiłki i treningi.</p>,
              <p>Aby w pełni wykorzystać możliwości serwisu, wybierz trenera i wykup usługę.<br/>Możesz skorzystać z treningu personalnego lub wykupić pakiet bieżącej konsultacji dietetycznej.</p>,
              <p>Po wykupieniu usługi panel będzie miejscem Twojej bieżącej komunikacji z trenerem. <br/>W zależności od wykupionej usługi, umówisz tutaj trening lub wykorzystasz pakiet konsultacji dietetycznej.</p>];
          }else{
              if(this.props.notify.trainingInfo){
                  let lastTraining = this.props.goods.trainPlans.sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt) )[0] || {};
                  headerText = <p>Witaj, wykupiłeś pakiet treningów:<br/><b>{lastTraining.plan.name}</b><br/>u trenera:<br/><b>{lastTraining.trainer.name}</b></p>;
                  headers = [<p><b>1</b><br/>Kontakt z trenerem</p>, 
                  <p><b>2</b><br/>Trening z trenerem</p>, 
                  <p><b>3</b><br/>Wskazówki od trenera</p>];
                  texts = [<p>Skontaktuj się z trenerem telefonicznie aby ustalić godziny treningów.</p>,
                  <p>Spotkajcie się w ustalonym miejscu i preprowadźcie wspólny trening</p>,
                  <p>Po trzeningu otrzymasz wskazówki od trenera, które zawsze będą dla Ciebie dostępne w panelu serwisu. </p>];
              }else if(this.props.notify.freeSample){
                  headerText = <p>Witaj, wybrałeś opcję darmowej konsultacji u trenera<br/>{this.props.goods.feedPlan.trainer.name}</p>;
                  headers = [<p><b>1</b><br/>Ankieta</p>, 
                  <p><b>2</b><br/>Dziennik aktywności</p>, 
                  <p><b>3</b><br/>Darmowa konsultacja</p>];
                  texts = [<p>Upewnij się, że prawidłowo wypełniłeś ankietę w zakładce "Ankieta". Na jej podstawie otrzymasz od trenera Twoje indywidualne zalecenia.</p>,
                  <p>Wypełnij dziennik aktywności przynajmniej przez jeden pełny dzień. Uzupełniasz tam informacje o spożywanych posiłkach a także wykonanych treningach tego dnia.</p>,
                  <p>Trener przygotuje dla Ciebie darmową poradę. Znajdziesz ją w zakładce "Zalecenia trenera". Jeżeli uznasz, że warto rozpocząć dłuższą współpracę, wykup na stronie trenera usługę konsultacji dietetycznej na dłuższy okres.</p>];
              }else if(this.props.notify.feedInfo){
                  headerText = <p>Witaj, wykupiłeś pakiet:<br/>Konsultacja dietetyczna ważna do <b>{this.props.goods.feedPlan.validToStr}</b><br/>u trenera:<br/><b>{this.props.goods.feedPlan.trainer.name}</b></p>;
                  headers = [<p><b>1</b><br/>Zalecenia trenera</p>, 
                  <p><b>2</b><br/>Dziennik aktywności</p>, 
                  <p><b>3</b><br/>Wskazówki od trenera</p>];
                  texts = [<p>Upewnij się, że prawidłowo wypełniłeś ankietę w zakładce "Ankieta". Na jej podstawie otrzymasz od trenera Twoje indywidualne zalecenia.</p>,
                  <p>Codziennie wypełniaj dziennik aktywności. Uzupełnisz tutaj informacje o spożywanych posiłkach a także wykonanych treningach.</p>,
                  <p>Twój trener będzie wspólnie z Tobą realizował Twój plan. Codziennie w panelu otrzymasz informację zwrotną ze wskazówkami dotyczącymi spożywanych posiłków.</p>];
              }              
          }
        }        
        return (
            <div className='welcome-popup'>
                <h3 className='text-center'>
                    <span>{headerText}</span>
                </h3>
                <Well bsSize="large" style={{'textAlign':'center'}}>
                  <Row>
                     <Col lg={4} md={4} sm={4} xs={12}>
                            <h3>{headers[0]}</h3>
                            {texts[0]}
                     </Col>
                     <Col lg={4} md={4} sm={4} xs={12}>
                           <h3>{headers[1]}</h3>
                            {texts[1]}
                     </Col>
                      <Col lg={4} md={4} sm={4} xs={12}>
                            <h3>{headers[2]}</h3>
                            {texts[2]}
                     </Col>
                  </Row>
                  <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                          <div onClick={this.close.bind(this)} className="btn btn-primary mr pull-right">OK</div>
                      </Col>
                      <Col lg={12} md={12} sm={12} xs={12}>
                          <div className='text-right'>
                              <label htmlFor='dontRemind' className='pointer' style={{margin: '9px 10px 0 0'}}>Nie przypominaj mi o tym następnym razem</label>
                              <div className="checkbox c-checkbox pull-right">
                                  <label>
                                      <input type="checkbox" name="dontRemind" id='dontRemind'
                                      checked={this.state.dontRemind} 
                                      onChange={this.handleNotificationsCheckbox.bind(this)} />
                                      <em className="fa fa-check"></em>
                                  </label>
                              </div>
                          </div>
                      </Col>
                  </Row>
                </Well>
            </div>
        );
    }

}

export default withRouter(WelcomeScreen);
