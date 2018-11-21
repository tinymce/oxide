(function() {
  const debounce = (fn, time) => {
    let timeout;

    return function() {
      const functionCall = () => fn.apply(this, arguments);

      clearTimeout(timeout);
      timeout = setTimeout(functionCall, time);
    };
  };

  const defaultVars = {
    'background-color': '#fff',
    'base-value': '16px',
    'color-black': '#222f3e',
    'color-tint': '#3498db',
    'color-white': '#fff'
  };

  const changeBodyBackground = (data) => document.body.style.backgroundColor = data['site-background-color'] || null;

  const getData = () => {
    if (localStorage.getItem('tinymce-oxide-skin-vars') !== null) {
      const variables = parse(
        localStorage.getItem('tinymce-oxide-skin-vars')
      );
      less.modifyVars(variables);
      changeBodyBackground(variables);

      return variables;
    } else {
      return defaultVars;
    }
  };

  const json = fetch('/skin/less-variables.json').then((x) => {
    return x.json();
  })

  const findMatch = (term) => {
    return json.then((val) => {
      const allVals = {...val, 'site-background-color': '#fff'};
      return Object.keys(allVals).filter((s) => s.includes(term));
    });
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

  const regex = /(^[^:]+\s*): ([^;]*);/;
  const stringify = obj => Object.keys(obj).reduce((acc, key) => acc + `${key}: ${obj[key]};\n`, '');
  const parse = str => str.split('\n').reduce((acc, line) => {
    const match = regex.exec(line);
    if (match) {
      acc[match[1]] = match[2];    
    }
    return acc;    
  }, {})

  const editor_json = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: false,
    mode: 'text/css',
    lint: true,
    theme: 'material',
    extraKeys: {
      'Ctrl-.': 'autocomplete'
    },
    hintOptions: { hint: findHint }
  });
  const data = getData();
  editor_json.setValue(stringify(data, 0, 2));
  editor_json.on(
    'change',
    debounce((cm) => {
      const val = cm.getValue();
      const json = parse(val);
      if (Object.keys(json).length !== 0) {
        localStorage.setItem('tinymce-oxide-skin-vars', stringify(json));
        less.modifyVars(json);
        changeBodyBackground(json);
      }
    }, 1500)
  );

  const button = document.querySelector('button#reset');
  button.addEventListener('click', () => {
    localStorage.clear();
    const data = getData();
    editor_json.setValue(stringify(data));
  });

  // Set up split.js for resizable panes
  // https://github.com/nathancahill/Split.js
  Split(['#left', '#right'], {
    sizes: [30, 70]
  });

})();
