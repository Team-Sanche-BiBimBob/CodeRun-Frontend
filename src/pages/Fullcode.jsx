import React, { useState } from 'react';
import './Fullcode.css';

const Fullcode = () => {
  const [code, setCode] = useState('');
  const exampleCode = [
    'function hello() {',
    '  console.log("안녕하세요!");',
    '  return "성공!";',
    '}'
  ].join('\n');

  const renderLineNumbers = (count) => {
    const lineCount = Math.max(1, count);
    return Array.from({ length: lineCount }, (_, i) => (
      <div key={i} className="line-number">{i + 1}</div>
    ));
  };
  
  const exampleLines = exampleCode.split('\n');
  const inputLines = code.split('\n');
  const exampleLineCount = exampleLines.length;
  const inputLineCount = Math.max(1, inputLines.length);

  const renderHighlightedCode = () => {
    const exampleLines = exampleCode.split('\n');
    const userLines = code.split('\n');
    
    const displayLines = [...exampleLines];

    return (
      <div className="code-content">
        <div className="line-numbers">
          {renderLineNumbers(exampleLineCount)}
        </div>
        <div className="code-lines">
          {displayLines.map((line, lineIndex) => {
            const userLine = userLines[lineIndex] || '';
            const chars = [];
            
            for (let i = 0; i < line.length; i++) {
              const userChar = userLine[i];
              let className = '';
              
              if (i < userLine.length) {
                className = userChar === line[i] ? 'code-correct' : 'code-incorrect';
              }
              
              chars.push(
                <span key={i} className={className}>
                  {line[i]}
                </span>
              );
            }
            
            return (
              <div key={lineIndex} className="code-line">
                {chars}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fullcode-container">
      <div className="code-display">
        <div className="code-header">예시 코드</div>
        <pre className="code-block">
          {renderHighlightedCode()}
        </pre>
      </div>
      <div className="code-input">
        <div className="code-header">코드 입력</div>
        <div className="code-editor-container">
          <div className="line-numbers">
            {renderLineNumbers(inputLineCount)}
          </div>
          <div className="code-input-wrapper">
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              placeholder="예시 코드를 따라 쳐보세요..."
            />
            <div className="code-hint">
              {inputLines.map((line, i) => (
                <div key={i} className="hint-line">
                  {exampleLines[i] || ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullcode;