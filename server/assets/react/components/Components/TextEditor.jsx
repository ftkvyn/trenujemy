import React from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Grid, Row, Col, Panel, Button, FormControl, FormGroup, InputGroup, DropdownButton, MenuItem, Well } from 'react-bootstrap';
import { saveImage } from '../Common/filesService';

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
        if(this.props.text){
          $('#summernote').summernote('code', this.props.text);
        }
    }

    componentWillUnmount(){
      try{
        $('#summernote').summernote('destroy');
        var markupStr = $('#summernote').summernote('code');
        if(this.props.onChange){
          this.props.onChange(markupStr);
        }
      }
      catch(ex){
        console.error(ex);
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

