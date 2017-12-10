import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';

class TextEditor extends React.Component {
    
    componentDidMount(){
        let me = this;
        $('#summernote').summernote({
          height: 400, 
          callbacks: {
              onBlur: function() {
                var markupStr = $('#summernote').summernote('code');
                if(me.props.onChange){
                  me.props.onChange(markupStr);
                }
              }
            }
        });
        if(this.props.text){
          $('#summernote').summernote('code', this.props.text);
        }
    }

    componentWillUnmount(){
      $('#summernote').summernote('destroy');
      var markupStr = $('#summernote').summernote('code');
      if(me.props.onChange){
        me.props.onChange(markupStr);
      }
    }

    render() {  
        return (
            <fieldset>
                <div className="form-group">
                    <label className="col-sm-2 control-label">{this.props.label}</label>
                    <Col sm={ 10 }>
                      <div id="summernote" style={{minHeight:'400px'}}></div>
                    </Col>
                </div>
            </fieldset>
        );
    }

}

export default TextEditor;

