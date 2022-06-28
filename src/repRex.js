import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function EditorRich() {
  const editorConfig = {
    editorState:
      '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"hi","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
  };

  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  function onChange(editorState) {
    const jsonString = JSON.stringify(editorState);
    setLex(jsonString);
    console.log(jsonString);
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
