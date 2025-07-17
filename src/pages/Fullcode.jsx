import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Fullcode.css';

const Fullcode = () => {
  const [code, setCode] = useState('');
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  const isComposingRef = useRef(false);
  const lastValueRef = useRef('');

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // 모든 언어에 대한 검증 비활성화
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true
    });
    
    // 모든 언어에 대한 검증 비활성화
    monaco.languages.getLanguages().forEach(language => {
      monaco.languages.registerDocumentSemanticTokensProvider(language.id, {
        getLegend: () => ({
          tokenTypes: [],
          tokenModifiers: []
        }),
        provideDocumentSemanticTokens: () => ({
          data: new Uint32Array(),
          resultId: null
        }),
        releaseDocumentSemanticTokens: () => {}
      });
    });
    
    // 에디터 옵션 설정 (스펠링 체크, 시맨틱 검증 비활성화)
    editor.updateOptions({
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      parameterHints: {
        enabled: false
      },
      suggest: {
        showKeywords: false,
        showSnippets: false,
        showClasses: false,
        showFunctions: false,
        showVariables: false,
        showModules: false,
        showFiles: false,
        showReferences: false,
        showFolders: false,
        showTypeParameters: false,
        showConstants: false,
        showProperties: false,
        showValues: false,
        showIssues: false,
        showUsers: false,
        showWords: false,
        showColors: false,
        showOperators: false,
        showUnits: false
      },
      'semanticHighlighting.enabled': false,
      'semanticValidation': false,
      'suggestSelection': 'none',
      'suggest.showStatusBar': false,
      'suggest.showIcons': false,
      'suggest.showInlineDetails': false,
      'suggest.showMethodSuggestions': false,
      'suggest.showFunctionSuggestions': false,
      'suggest.showConstructorSuggestions': false,
      'suggest.showDeprecated': false,
      'suggest.showFieldSuggestions': false,
      'suggest.showVariableSuggestions': false,
      'suggest.showClassSuggestions': false,
      'suggest.showStructSuggestions': false,
      'suggest.showInterfaceSuggestions': false,
      'suggest.showModuleSuggestions': false,
      'suggest.showPropertySuggestions': false,
      'suggest.showEventSuggestions': false,
      'suggest.showOperatorSuggestions': false,
      'suggest.showUnitSuggestions': false,
      'suggest.showValueSuggestions': false,
      'suggest.showConstantSuggestions': false,
      'suggest.showEnumSuggestions': false,
      'suggest.showEnumMemberSuggestions': false,
      'suggest.showKeywordSuggestions': false,
      'suggest.showTextSuggestions': false,
      'suggest.showIssueSuggestions': false,
      'suggest.showUserSuggestions': false,
      'suggest.showSnippetSuggestions': false,
      'suggest.showColorSuggestions': false,
      'suggest.showFileSuggestions': false,
      'suggest.showReferenceSuggestions': false,
      'suggest.showFolderSuggestions': false,
      'suggest.showTypeParameterSuggestions': false,
      'suggest.showSnippetOnTab': false,
      'suggest.filterGraceful': false,
      'suggest.localityBonus': false,
      'suggest.shareSuggestSelections': false,
      'suggest.showCustomcolors': false,
      'suggest.showVariables': false,
      'suggest.showKeywords': false,
      'suggest.showSnippets': false,
      'suggest.showClasses': false,
      'suggest.showColors': false,
      'suggest.showConstants': false,
      'suggest.showConstructors': false,
      'suggest.showValues': false,
      'suggest.showFolders': false,
      'suggest.showUsers': false,
      'suggest.showIssues': false
    });

    // 에디터에 키다운 이벤트 리스너 추가
    editor.onKeyDown((e) => {
      // 한글 조합 중이 아닌 경우에만 즉시 업데이트
      if (!isComposingRef.current) {
        // 약간의 지연을 두어 입력이 완전히 처리되도록 함
        setTimeout(() => {
          if (editorRef.current) {
            const value = editorRef.current.getValue();
            if (value !== lastValueRef.current) {
              lastValueRef.current = value;
              // updateDecorations(value);
            }
          }
        }, 0);
      }
    });
  };

  // 데코레이션 업데이트 함수
  const updateDecorations = (value) => {
    if (!editorRef.current) return;
    
    const model = editorRef.current.getModel();
    const newDecorations = [];
    const inputLines = (value || '').split('\n');
    
    inputLines.forEach((line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      const exampleLine = exampleLines[lineIndex] || '';
      // 현재 줄의 각 문자를 비교
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const exampleChar = exampleLine[i];
        if (char === exampleChar) {
          // 일치하는 문자: 초록색
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-correct-char',
            }
          });
        } else { 
          // 일치하지 않는 문자: 빨간색
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-incorrect-char',
            }
          });
        }
      }
      
      // 예시보다 긴 부분은 빨간색으로 표시
      if (line.length > exampleLine.length) {
        for (let i = exampleLine.length; i < line.length; i++) {
          newDecorations.push({
            range: new monaco.Range(lineNumber, i + 1, lineNumber, i + 2),
            options: {
              inlineClassName: 'code-incorrect-char',
            }
          });
        }
      }
    });
    
    // 기존 장식 제거하고 새 장식 적용
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  };

  const handleEditorChange = (value, event) => {
    setCode(value || '');
    
    // 값이 변경되었는지 확인
    if (value !== lastValueRef.current) {
      lastValueRef.current = value;
      // 한글 입력 중이 아닐 때만 즉시 업데이트
      if (!isComposingRef.current) {
        updateDecorations(value);
      }
    }
  };
  const exampleCode = [
    'function hello() {',
    '  console.log("안녕하세요!");',
    '  return "성공!";',
    '}'
  ].join('\n');

  const exampleLines = exampleCode.split('\n');
  return (
    <div className="fullcode-container">
      <div className="code-display" style={{ position: 'relative' }}>
        <div className="code-header">예시 코드</div>
        <div className="monaco-editor-container">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, cursor: 'not-allowed' }} />
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={exampleCode}
            options={{
              readOnly: true,
              lineNumbers: 'on',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              wordWrap: 'on',
              automaticLayout: true,
              renderWhitespace: 'selection',
              tabSize: 2,
              domReadOnly: true,
              readOnlyMessage: { value: '이 코드는 예시용입니다.' },
              cursorStyle: 'hidden',
              contextmenu: false,
              theme: 'vs-dark',
              lineNumbersMinChars: 4,
              lineDecorationsWidth: 10,
              renderLineHighlight: 'none',
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 0,
                horizontalScrollbarSize: 0,
              },
            }}
          />
        </div>
      </div>
      <div className="code-input">
        <div className="code-header">코드 입력</div>
        <div className="monaco-editor-container">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            autoIndent: "full",
            formatOnType: true,
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            fontSize: 12,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            renderWhitespace: 'selection',
            tabSize: 2,
            quickSuggestions: false,
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: "off",
            wordBasedSuggestions: false,
            lineNumbersMinChars: 4,
            lineDecorationsWidth: 10,
            links: false,
            hover: false,
            parameterHints: { enabled: false },
            autoClosingBrackets: 'never',
            autoClosingQuotes: 'never',
            autoSurround: 'never',
          }}
          />
        </div>
      </div>
    </div>
  );
};

export default Fullcode;