import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import {loadAdviceTemplates, saveAdviceTemplate, removeAdviceTemplate, addAdviceTemplate} from '../Common/adviceTemplateService';
import TextEditor from '../Components/TextEditor'

let hideAlertSuccess = null;
let hideAlertError = null;

let saveHandler = null;


function saveDataFn(itemId, text){
    saveAdviceTemplate(itemId, text)
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


class AdviceTemplatesPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        let initialState = {
            newItemName: '',
            selectedItemId: null,
            templateText: '',
            items: []
        };
        this.state = initialState;        
    };

    componentDidMount(){
        $('[data-scrollable]').slimScroll({
            height: ($('[data-scrollable]').data('height') || 200)
        });
        loadAdviceTemplates()
            .then((data) => {
                if(data.length){
                    this.setState({items: data, selectedItemId:data[0].id, templateText:data[0].text});
                }else{
                    this.setState({items: data});
                }
            });
    }

    saveTemplate(){
        try{
          var markupStr = $('#summernote').summernote('code');
          let item = this.state.items.find((item) => item.id == this.state.selectedItemId);
          item.text = markupStr;
          this.setState({templateText: markupStr});
          saveDataFn(this.state.selectedItemId, markupStr);
        }
        catch(ex){
          console.error(ex);
        }
    }

    componentWillUnmount(){
        this.saveTemplate();
    }

    selectItem(id){
        this.saveTemplate();
        let item = this.state.items.find((i) => i.id == id);
        this.setState({selectedItemId:id, templateText: item.text});
    }

    removeItem(id, event){
        event.stopPropagation();
        let item = this.state.items.find((item) => item.id == id);
        if(!confirm('Czy jesteś pewny że chcesz usunąć szablon '+ item.name + '?')){
            return;
        }
        removeAdviceTemplate(id)
             .then((data) => {
                    let itemNum = this.state.items.findIndex((item) => item.id == data.id);
                    let items = [
                        ...this.state.items.slice(0, itemNum),
                        ...this.state.items.slice(itemNum + 1)];
                    let selectedId = this.state.selectedItemId;
                    let templateText = this.state.templateText;
                    if(this.state.selectedItemId == id){
                        if(items.length){
                            selectedId = items[0].id;
                            templateText = items[0].text;
                        }else{
                            selectedId = null;
                            templateText = '';
                        }
                    }
                    this.setState({items: items, selectedItemId: selectedId, templateText: templateText});
                });
    }

    onFormSubmit(event){
        this.addNewItem();
        event.preventDefault();
        return false;
    }

    addNewItem(){
        if(!this.state.newItemName){
            return;
        }
        this.saveTemplate();
        const name = this.state.newItemName;
        this.setState({newItemName: ''});
        addAdviceTemplate(name)
             .then((item) => {
                    let items = [item, ...this.state.items];
                    this.setState({items: items, selectedItemId: item.id, templateText: ''});
                });
    }

    handleNewItemChange(event) {
        this.setState({newItemName: event.target.value});
    }

    render() {  
        let textareaReadonly = {}
        if(!this.state.selectedItemId){
          textareaReadonly = {readOnly: true};
        }
        
        return (
            <ContentWrapper>
                <h3>Szablony zaleceń</h3>
                <Row>
                   <Col lg={12} md={12} sm={12}>
                        <Well bsSize="large" style={{'textAlign':'center'}}>
                            <h1><em className="fa fa-lightbulb-o"></em></h1>
                            <p>Edycja szablonów gotowych odpowiedzi do klienta. Zalecamy każdorazowe edytowanie odpowiedzi przed jej wysłaniem i traktowanie szablonów jako ułatwienie codziennej pracy a nie jako gotowe odpowiedzi.</p>
                        </Well>
                        <Panel>
                            <Row>
                                <form className="form-horizontal" onSubmit={this.onFormSubmit.bind(this)}>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <div data-height="400" data-scrollable="" className="list-group">
                                            {this.state.items.map( (item) => <div 
                                                className={this.state.selectedItemId == item.id ? 'selected list-group-item pointer' : 'list-group-item pointer'}
                                                key={item.id}
                                                onClick={this.selectItem.bind(this, item.id)}>
                                                <div className="media-box">
                                                    <div className="media-box-body clearfix">
                                                        <span className="mb-sm pointer">
                                                            {item.name}
                                                        </span>
                                                        <div className="pull-right">
                                                            <em className="fa fa-trash pointer" onClick={this.removeItem.bind(this, item.id)} />
                                                        </div>
                                                    </div>                                                
                                                </div>
                                            </div>)}                                            
                                        </div>

                                        <FormControl type="text" placeholder="Nazwa nowego szablonu" 
                                            maxLength='80'
                                            className="form-control"
                                            name='name'
                                            value={this.state.newItemName}
                                            onChange={this.handleNewItemChange.bind(this)}/>
                                        <label className="col-lg-12 control-label text-right no-padding">Maks. 80 znaków</label>
                                        <div>
                                            <div type="button" onClick={this.addNewItem.bind(this)} className="btn btn-primary pull-right">Dodaj nowy</div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={12} sm={12} xs={12} style={{'marginTop':'20px'}}>
                                        <div className='template-textarea' style={ this.state.selectedItemId ? {} : {'display':'none'}}>
                                            <TextEditor text={this.state.templateText} label="Plan dietetyczny i treningowy" onBlur={this.saveTemplate.bind(this)}></TextEditor>
                                            <div type="button" onClick={this.saveTemplate.bind(this)} className="btn btn-primary pull-right">Zapisz</div>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div role="alert" className="alert alert-success saveSuccess" style={{display:'none'}}>
                                            Dane zapisane poprawnie.                
                                        </div>  
                                        <div role="alert" className="alert alert-danger saveError" style={{display:'none'}}>
                                            Nie udało się zapisać dane.
                                        </div>   
                                    </Col>                                                                        
                                </form>
                            </Row>
                        </Panel>
                    </Col>
                </Row>
            </ContentWrapper>
        );
    }
}

export default AdviceTemplatesPage;

