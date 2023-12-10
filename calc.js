//приоритезация функций
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку с арифметическим выражением и делит его на токены  (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

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

// преобразует инфиксную нотацию в обратную польскую и разделяет и числа и опреранды пробелами

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
    let stack = []; // Создание пустого массива stack, который будет использоваться для хранения чисел и промежуточных результатов вычислений.
    let tokens = str.split(' '); // Разделение входной строки на массив подстрок по символу пробела и сохранение в переменной tokens.

    for (token of tokens) { //перебор каждого элемент массива tokens.
        if (isNumeric(token)) { // Проверка, является ли текущий элемент числом.
            stack.push(parseFloat(token)); // Если текущий элемент является числом, он преобразуется в число с плавающей запятой и добавляется в конец массива stack для работы с дробными числами
        } else if (isOperation(token)) { // Если текущий элемент не является числом, но является операцией (+, -, *, /).
            let operand2 = stack.pop(); // Извлечение последнего элемента из массива stack и сохранение в переменной operand2 - это второй операнд для операции.
            let operand1 = stack.pop(); // Извлечение следующего элемента из массива stack и сохранение в переменной operand1 - это первый операнд для операции.
            if (token === '+') { .
                stack.push(operand1 + operand2); // Результат сложения добавляется в конец массива stack.
            } else if (token === '-') {
                stack.push(operand1 - operand2); // Результат вычитания добавляется в конец массива stack.
            } else if (token === '*') {
                stack.push(operand1 * operand2); // Результат умножения добавляется в конец массива stack.
            } else if (token === '/') {
                stack.push(operand1 / operand2); // Результат деления добавляется в конец массива stack.
            }
        }
    }

    return stack.pop() // Возврат последнего элемента из массива stack - это итоговый результат вычислений.
}


//обработка событий клика по кнопкам
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
      outputbox.value = result.toFixed(2); //округляем до двух знаков после запятой
  }
  else
  {
      outputbox.value += event.target.textContent;
  }
}

window.onload = function ()
{
    const butkeys = document.querySelectorAll('.key');
    //обработчик клика на кнопки
    for (let i = 0; i < butkeys.length; i++)
        butkeys[i].addEventListener('click',clickHandler )
}

