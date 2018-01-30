import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { saveImage } from '../Common/filesService';

function destroySummernote(){
    try{
      var markupStr = $('#summernote').summernote('code');
      $('#summernote').summernote('destroy');      
      if(this.props.onExit){
        this.props.onExit(markupStr);
      }
    }
    catch(ex){
      console.error(ex);
    }
}

function initSummernote(text){
    let me = this;
    $('#summernote').summernote({
      height: 400, 
      callbacks: {
          onBlur: function() {
            var markupStr = $('#summernote').summernote('code');
            if(me.props.onBlur){
              me.props.onBlur(markupStr);
            }
          },
          onImageUpload: function(files) {
            var formData = new FormData();
            var fileData = files[0];
            formData.append('file', fileData);
            saveImage(formData)
            .then((data) => {
                data.url;
                let imgNode = document.createElement("img");
                imgNode.src = data.url;
                // upload image to server and create imgNode...
                $('#summernote').summernote('insertNode', imgNode);
            })
            .catch(function(err){
              console.error(err);
            });                
          }
        }
    });
    $('#summernote').summernote('code', text);
}

class TextEditor extends React.Component {
    
    componentDidMount(){
        initSummernote.call(this,this.props.text);
    }

    componentWillUnmount(){
        destroySummernote.call(this);
    }

    componentWillUpdate(nextProps) {
        var markupStr = $('#summernote').summernote('code');
        if((typeof markupStr == 'undefined') || (markupStr.localeCompare(nextProps.text) != 0 )){
            $('#summernote').summernote('code', nextProps.text);
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

