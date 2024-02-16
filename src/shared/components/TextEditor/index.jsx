import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import {
  BASIC_TEXT_EDITOR_OPTIONS,
  EDITOR_API_KEY,
  EDITOR_VERSION,
} from './config';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    // this.props.editorRef = React.createRef();
  }

  render() {
    console.log(`${JSON.stringify(process.env)}`);

    const {
      height = 200,
      width = 800,
      editorId = '',
      editorOptions = {},
      handleEditorChange,
      text,
      // editorRef,
    } = this.props;

    return (
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        zapiKey={EDITOR_API_KEY}
        id={editorId}
        xcloudChannel={EDITOR_VERSION}
        // eslint-disable-next-line
        value={text}
        // eslint-disable-next-line
        onEditorChange={handleEditorChange}
        init={{
          width,
          height,
          ...(editorId && { selector: `textarea#${editorId}` }),
          ...BASIC_TEXT_EDITOR_OPTIONS,
          ...editorOptions,
        }}
      />
    );
  }
}

export default TextEditor;
