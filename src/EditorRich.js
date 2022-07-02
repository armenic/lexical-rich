import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { CLEAR_HISTORY_COMMAND } from "lexical";
import { Fragment, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ExampleTheme from "./themes/ExampleTheme";

const useStickyState = (defaultValue, key = "lex") => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default function EditorRich() {
  // Editor state
  const [lex, setLex] = useStickyState({
    root: {
      children: [
        {
          children: [],
          direction: null,
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
  // Worksheet state
  const [ws, setWs] = useStickyState({}, "ws");

  // A component (plugin) with a button that updates the state of lexical. As long
  // as this component is used within LexicalComposer it will work. Within
  // LexicalComposer one can use any layout, for example cols, rows, divs.
  const UpdatePlugin = () => {
    const [editor] = useLexicalComposerContext();

    const onButtonClick = (ws_key) => {
      const editorState = editor.parseEditorState(JSON.stringify(ws[ws_key]));
      editor.setEditorState(editorState);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    };

    return (
      <>
        {Object.keys(ws).map((ws_key) => {
          return (
            <Fragment key={ws_key}>
              <Button
                onClick={() => {
                  onButtonClick(ws_key);
                }}
              >
                {ws_key}
              </Button>
              <br />
              <br />
            </Fragment>
          );
        })}
        <br />
        <br />
        <Button onClick={onSaveButtonClick}>Save</Button>
      </>
    );
  };

  const editorConfig = {
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: JSON.stringify(lex),
  };

  function onLexChange(editorState) {
    setLex(editorState);
  }

  const onSaveButtonClick = () => {
    const d = new Date();
    const textD = d.toISOString();

    setWs({
      ...ws,
      [textD]: lex,
    });
  };

  return (
    <Container>
      <LexicalComposer initialConfig={editorConfig}>
        <Row>
          <Col>
            <UpdatePlugin />
          </Col>
          <Col>
            <div className="editor-container">
              <ToolbarPlugin />
              <div className="editor-inner">
                <RichTextPlugin
                  contentEditable={<ContentEditable className="editor-input" />}
                  placeholder={
                    <div className="editor-placeholder">
                      Enter some rich text...
                    </div>
                  }
                />
                <OnChangePlugin
                  onChange={onLexChange}
                  ignoreSelectionChange={true}
                />
                <HistoryPlugin />
                <TreeViewPlugin />
                <AutoFocusPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <LinkPlugin />
                <AutoLinkPlugin />
                <ListMaxIndentLevelPlugin maxDepth={4} />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
              </div>
            </div>
          </Col>
        </Row>
      </LexicalComposer>
    </Container>
  );
}
