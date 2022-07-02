import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { CLEAR_HISTORY_COMMAND } from "lexical";

// The desired state I want the Lexical editor be when I click the button
const desiredUpdate = {
  editorState: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "update",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  },
  lastSaved: 1656765599382,
  source: "Playground",
  version: "0.3.6",
};

// A component (plugin) with a button that updates the state of lexical. As long
// as this component is used within LexicalComposer it will work. Within
// LexicalComposer one can use any layout, for example cols, rows, divs.
const UpdatePlugin = () => {
  const [editor] = useLexicalComposerContext();

  const onButtonClick = () => {
    const editorState = editor.parseEditorState(
      JSON.stringify(desiredUpdate.editorState)
    );
    editor.setEditorState(editorState);
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  };

  return <button onClick={onButtonClick}>Update editor state</button>;
};

export default function EditorMin() {
  return (
    <LexicalComposer initialConfig={{ theme: {} }}>
      <PlainTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div>Enter some text...</div>}
      />
      {/* Make sure you use the UpdatePlugin within LexicalComposer */}
      <UpdatePlugin />
    </LexicalComposer>
  );
}
