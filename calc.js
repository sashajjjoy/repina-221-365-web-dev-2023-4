function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

function evaluate(str) {
    let stack = [];
    let tokens = str.split(' ');

    for (token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            let operand2 = stack.pop();
            let operand1 = stack.pop();
            if (token === '+') {
                stack.push(operand1 + operand2);
            } else if (token === '-') {
                stack.push(operand1 - operand2);
            } else if (token === '*') {
                stack.push(operand1 * operand2);
            } else if (token === '/') {
                stack.push(operand1 / operand2);
            }
        }
    }

    return stack.pop();
}

function clickHandler(event) {
  const outputbox = document.querySelector('#result');
  if(event.target.textContent == 'C')
  {
     outputbox.value = ''
  }
  else if (event.target.textContent == '<-')
  {
      outputbox.value = outputbox.value.slice(0, -1)
  }
  else if (event.target.textContent == '=') {
      let expression = outputbox.value;
      let rpnExpression = compile(expression);
      let result = evaluate(rpnExpression);
      outputbox.value = result.toFixed(2);
  }
  else
  {
      outputbox.value += event.target.textContent;
  }
}

window.onload = function ()
{
    const butkeys = document.querySelectorAll('.key');
    for (let i = 0; i < butkeys.length; i++)
        butkeys[i].addEventListener('click',clickHandler )
}

