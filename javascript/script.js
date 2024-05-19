// Mengambil referensi elemen-elemen yang diperlukan dari DOM
const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");
const historyList = document.querySelector("#history-list");
const themeToggleBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
const particles = document.querySelector(".particles");
const toggleIcon = document.querySelector(".toggler-icon");

// Fungsi untuk menghitung faktorial
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

// Fungsi untuk menambahkan item ke riwayat
function addHistoryItem(expression, result) {
  const tokens = expression.match(/[\w.]+|\*\*|[^\w\s.]/g);
  const spacedExpression = tokens.join(' ');
  result = parseFloat(result.toFixed(12));
  const historyItem = document.createElement("li");
  historyItem.textContent = `${spacedExpression} = ${result}`;
  historyList.appendChild(historyItem);
}

// Fungsi yang menangani klik tombol pada kalkulator
function handleButtonClick(event) {
  const buttonId = event.target.id || event.target.getAttribute('data-key');
  const currentValue = display.innerText;

  // Logika untuk masing-masing tombol
  if (buttonId === "clear") {
    display.innerText = "";
  } else if (buttonId === "backspace") {
    display.innerText = currentValue.slice(0, -1);
  } else if (buttonId === "equal") {
    try {
      let currentValue = display.innerText;

      // Mengubah ekspresi faktorial ke format yang dapat dievaluasi
      currentValue = currentValue.replace(/(\d+)!/g, (match, number) => {
        return `factorial(${number})`;
      });

      // Mengubah persen ke pembagian
      currentValue = currentValue.replace(/(\d+)%/g, (match, number) => {
        return `(${number}/100)/*percent*/`;
      });

      // Mengubah fungsi trigonometri dari derajat ke radian
      currentValue = currentValue.replace(/Math\.sin\(/g, "Math.sin(Math.PI/180*");
      currentValue = currentValue.replace(/Math\.cos\(/g, "Math.cos(Math.PI/180*");
      currentValue = currentValue.replace(/Math\.tan\(/g, "Math.tan(Math.PI/180*");

      let originalValue = currentValue;

      // Evaluasi ekspresi
      let result = eval(currentValue);
      result = parseFloat(result.toFixed(12));

      currentValue = currentValue.replace(/factorial\((\d+)\)/g, (match, number) => {
        return `${number}!`;
      });

      // Mengembalikan persen ke simbol
      currentValue = currentValue.replace(/\((\d+)\/100\)\/\*percent\*\//g, (match, number) => {
        return `${number}%`;
      });

      // Mengembalikan fungsi trigonometri ke bentuk asli
      currentValue = currentValue.replace(/Math\.sin\(Math\.PI\/180\*/g, "Math.sin(");
      currentValue = currentValue.replace(/Math\.cos\(Math\.PI\/180\*/g, "Math.cos(");
      currentValue = currentValue.replace(/Math\.tan\(Math\.PI\/180\*/g, "Math.tan(");

      // Menampilkan hasil dan menambahkannya ke riwayat
      display.innerText = result;
      addHistoryItem(currentValue, result);

      alert(`Result of ${currentValue} is: ${result}`);
    } catch (error) {
      display.innerText = "Error!";
      setTimeout(() => (display.innerText = ""), 2000);
    }
  } else if (buttonId === "%") {
    display.innerText += "%";
  } else if (buttonId === "sin") {
    display.innerText += "Math.sin(";
  } else if (buttonId === "cos") {
    display.innerText += "Math.cos(";
  } else if (buttonId === "tan") {
    display.innerText += "Math.tan(";
  } else if (buttonId === "power") {
    display.innerText += "**";
  } else if (buttonId === "pi") {
    display.innerText += "Math.PI";
  } else if (buttonId === "log") {
    display.innerText += "Math.log(";
  } else if (buttonId === "sqrt") {
    display.innerText += "Math.sqrt(";
  } else if (buttonId === "factorial") {
    display.innerText += "!";
  } else {
    display.innerText += buttonId;
  }
}

// Menambahkan event listener untuk setiap tombol
buttons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

// Event listener untuk tombol pada keyboard
document.addEventListener('keydown', (event) => {
  const key = event.key;
  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    button.click();
  }
});

// Event listener untuk menampilkan riwayat saat di-klik
historyList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    const historyExpression = event.target.textContent.split('=')[0].trim();
    display.innerText = historyExpression;
  }
});

// Event listener untuk beralih tema
themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  particles.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
};
