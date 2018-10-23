(function() {
  const debounce = (fn, time) => {
    let timeout;

    return function() {
      const functionCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  // const hints = function(codeMirror) {
  //   // Code found in xmlcomplete demo
  //   // https://github.com/codemirror/CodeMirror/blob/master/demo/xmlcomplete.html
  //   const completeAfter = function(cm, pred) {
  //     if (!pred || pred()) {
  //       setTimeout(function() {
  //         if (!cm.state.completionActive) {
  //           cm.showHint({ completeSingle: false });
  //         }
  //       }, 100);
  //     }
  //     return codeMirror.Pass;
  //   };

  //   const completeIfAfterLt = function(cm) {
  //     return completeAfter(cm, function() {
  //       const cur = cm.getCursor();
  //       return cm.getRange(codeMirror.Pos(cur.line, cur.ch - 1), cur) === '<';
  //     });
  //   };

  //   const completeIfInTag = function(cm) {
  //     return completeAfter(cm, function() {
  //       const tok = cm.getTokenAt(cm.getCursor());
  //       if (
  //         tok.type === 'string' &&
  //         (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) ||
  //           tok.string.length === 1)
  //       ) {
  //         return false;
  //       }
  //       const inner = codeMirror.innerMode(cm.getMode(), tok.state).state;
  //       return inner.tagName;
  //     });
  //   };

  //   return {
  //     completeAfter,
  //     completeIfAfterLt,
  //     completeIfInTag
  //   };
  // };

  const defaultVars = {
    'background-color': '#fff',
    'base-value': '16px',
    'color-black': '#222f3e',
    'color-tint': '#3498db',
    'color-white': '#fff'
  };

  const getData = () => {
    if (localStorage.getItem('tinymce-oxide-skin-vars') !== null) {
      const variables = JSON.parse(
        localStorage.getItem('tinymce-oxide-skin-vars')
      );
      less.modifyVars(variables);

      return variables;
    } else {
      return defaultVars;
    }
  };

  const findMatch = (term) => {
    return fetch('/skin/less-variables.json')
      .then((x) => x.json())
      .then((val) => Object.keys(val).filter((s) => s.includes(term)));
  };

  const findHint = async (cm, option) => {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    var start = cursor.ch,
      end = cursor.ch;
    while (start && /\w/.test(line.charAt(start - 1))) --start;
    while (end < line.length && /\w/.test(line.charAt(end))) ++end;
    var word = line.slice(start, end).toLowerCase();
    const data = await findMatch(word);
    return {
      list: data,
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end)
    };
  };

  // const h = hints(CodeMirror);

  const editor_json = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: false,
    mode: 'application/json',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
    theme: 'material',
    extraKeys: {
      'Ctrl-.': 'autocomplete',
      // '"': h.completeAfter,
      // '"': h.completeIfAfterLt,
      // '"': h.completeIfInTag,
      // '"': h.completeIfInTag,
    },
    hintOptions: { hint: findHint }
  });
  const data = getData();
  editor_json.setValue(JSON.stringify(data, 0, 2));
  editor_json.on(
    'change',
    debounce((cm) => {
      const val = cm.getValue();
      const lintingErrors = CodeMirror.lint.json(val);
      if (lintingErrors.length === 0) {
        localStorage.setItem('tinymce-oxide-skin-vars', val);
        less.modifyVars(JSON.parse(val));
      }
    }, 1500)
  );

  const button = document.querySelector('button#reset');
  button.addEventListener('click', () => {
    localStorage.clear();
    const data = getData();
    editor_json.setValue(JSON.stringify(data, 0, 2));
  });

  // Set up split.js for resizable panes
  // https://github.com/nathancahill/Split.js
  Split(['#left', '#right'], {
    sizes: [30, 70]
  });

})();
