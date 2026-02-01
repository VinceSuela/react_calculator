import { Empty } from "antd";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [preview, setPreview] = useState("");
  useEffect(() => {
    autoResizeDisplay();
    try {
      const evalPreview = eval(
        displayValue.replace(/×/g, "*").replace(/÷/g, "/"),
      );
      if (
        evalPreview !== undefined &&
        !isNaN(evalPreview) &&
        displayValue.length > 2
      ) {
        setPreview(evalPreview);
      } else {
        setPreview("");
      }
    } catch (e) {}
  }, [displayValue]);

  function append(value) {
    if (displayValue === "0" || displayValue === "" || displayValue === "Error") {
      if (value === ".") {
        setDisplayValue("0.");
        return;
      }
      setDisplayValue(value);
      return;
    }

    if (value === ".") {
      const lastNum = displayValue.split(/[+\-×÷]/).pop();
      if (lastNum.includes(".")) return;
      setDisplayValue(
        ["+", "-", "×", "÷"].includes(displayValue.slice(-1))
          ? displayValue + "0."
          : displayValue + ".",
      );
      return;
    }

    setDisplayValue(displayValue + value);
  }

  function trimTrailingOperators(expr) {
    return expr.replace(/[+\-*/\)\)]+$/, "");
  }

  function tokenize(displayValue) {
    return displayValue.match(/\d+\.?\d*|[()+\-*/]/g);
  }

  function calculate(expression) {
    const tokens = tokenize(expression);
    let index = 0;

    function parseExpression() {
      let value = parseTerm();

      while (tokens[index] === "+" || tokens[index] === "-") {
        const op = tokens[index++];
        const next = parseTerm();
        value = op === "+" ? value + next : value - next;
      }

      return value;
    }

    function parseTerm() {
      let value = parseFactor();

      while (tokens[index] === "*" || tokens[index] === "/") {
        const op = tokens[index++];
        const next = parseFactor();
        value = op === "*" ? value * next : value / next;
      }

      return value;
    }

    function parseFactor() {
      const token = tokens[index];

      if (token === "-") {
        index++;
        return -parseFactor();
      }

      if (token === "(") {
        index++;
        const value = parseExpression();
        index++;
        return value;
      }

      index++;
      return parseFloat(token);
    }

    return parseExpression();
  }

  function equals() {
    
    setPreview("");

    try {
      let expression = displayValue
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .trim();

      expression = trimTrailingOperators(expression);

      if (!expression) {
        setDisplayValue("0");
        return;
      }

      const result = calculate(expression);

      if (!Number.isFinite(result)) {
        setDisplayValue("Error");
        return;
      }

      const clean = Math.round((result + Number.EPSILON) * 1e10) / 1e10;

      setDisplayValue(String(clean));
    } catch {
      setDisplayValue("Error");
    }
  }

  function autoResizeDisplay() {
    const display = document.getElementById("display");
    const preview = document.getElementById("preview");

    display.scrollLeft = display.scrollWidth;
    preview.scrollLeft = preview.scrollWidth;

    const maxFont = 3;
    const minFont = 1.5;

    const prevMax = 2;
    const prevMin = 1;

    let prevFont = prevMax;
    preview.style.fontSize = prevFont + "rem";

    while (preview.scrollWidth > preview.clientWidth && prevFont > prevMin) {
      prevFont -= 0.1;
      preview.style.fontSize = prevFont + "rem";
    }

    let fontSize = maxFont;
    display.style.fontSize = fontSize + "rem";

    while (display.scrollWidth > display.clientWidth && fontSize > minFont) {
      fontSize -= 0.1;
      display.style.fontSize = fontSize + "rem";
    }
  }

  function multiply() {
    const last1 = displayValue.slice(-1);
    const last2 = displayValue.slice(-2);
    const operators = ["+", "-", "×", "÷"];

    if (last2 === "×-" || last2 === "÷-") {
      setDisplayValue(displayValue.replace(last2, "×"));
    } else if (operators.includes(last1)) {
      setDisplayValue(displayValue.slice(0, -1) + "×");
    } else {
      setDisplayValue(displayValue + "×");
    }
  }

  function add() {
    const last1 = displayValue.slice(-1);
    const last2 = displayValue.slice(-2);
    const operators = ["+", "-", "×", "÷"];

    if (last2 === "×-" || last2 === "÷-") {
      setDisplayValue(displayValue.replace(last2, "+"));
    } else if (operators.includes(last1)) {
      setDisplayValue(displayValue.slice(0, -1) + "+");
    } else {
      setDisplayValue(displayValue + "+");
    }
  }

  function subtract() {
    const last1 = displayValue.slice(-1);
    const last2 = displayValue.slice(-2);

    if (last2 === "×-" || last2 === "÷-") {
      setDisplayValue(displayValue.replace(last2, "-"));
    } else if (last1 === "-" || last1 === "+") {
      setDisplayValue(displayValue.slice(0, -1) + "-");
    } else {
      setDisplayValue(displayValue + "-");
    }
  }

  function divide() {
    const last1 = displayValue.slice(-1);
    const last2 = displayValue.slice(-2);
    const operators = ["+", "-", "×", "÷"];

    if (last2 === "×-" || last2 === "÷-") {
      setDisplayValue(displayValue.replace(last2, "÷"));
    } else if (operators.includes(last1)) {
      setDisplayValue(displayValue.slice(0, -1) + "÷");
    } else {
      setDisplayValue(displayValue + "÷");
    }
  }

  return (
    <>
      <div className="calculator">
        <div>
          <div id="display">{displayValue}</div>
          <div id="preview">{preview}</div>
        </div>

        <div id="buttons">

          <div id="num1">
            <button onClick={append.bind(this, "1")}>1</button>
          </div>

          <div id="num2">
            <button onClick={append.bind(this, "2")}>2</button>
          </div>

          <div id="num3">
            <button onClick={append.bind(this, "3")}>3</button>
          </div>

          <div id="add">
            <button onClick={add}>+</button>
          </div>

          <div id="num4">
            <button onClick={append.bind(this, "4")}>4</button>
          </div>

          <div id="num5">
            <button onClick={append.bind(this, "5")}>5</button>
          </div>

          <div id="num6">
            <button onClick={append.bind(this, "6")}>6</button>
          </div>

          <div id="subtract">
            <button onClick={subtract}>-</button>
          </div>

          <div id="num7">
            <button onClick={append.bind(this, "7")}>7</button>
          </div>

          <div id="num8">
            <button onClick={append.bind(this, "8")}>8</button>
          </div>

          <div id="num9">
            <button onClick={append.bind(this, "9")}>9</button>
          </div>

          <div id="multiply">
            <button onClick={multiply}>×</button>
          </div>

          <div id="parenthesis">
            <button onClick={append.bind(this, "(")}>(</button>
          </div>

          <div id="num0">
            <button onClick={append.bind(this, "0")}>0</button>
          </div>

          <div id="parenthesis2">
            <button onClick={append.bind(this, ")")}>)</button>
          </div>

          <div id="divide">
            <button onClick={divide}>÷</button>
          </div>

          <div id="decimal">
            <button onClick={append.bind(this, ".")}>.</button>
          </div>

          <div id="backSpace">
            <button
              onClick={() => {
                setDisplayValue(
                  displayValue.length > 1 ? displayValue.slice(0, -1) : "0",
                );
              }}>
              ⌫
            </button>
          </div>

          <div id="clear">
            <button onClick={() => setDisplayValue("0")}>AC</button>
          </div>

          <div id="equals">
            <button onClick={equals}>=</button>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
