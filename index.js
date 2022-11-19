import colors from "colors";

const [n1, n2] = process.argv.splice(2);

const getNormalNumbers = (n1, n2) => {
  let isValid = false;

  if (!+n1 || !+n2) {
    console.log("Принимаемые аргументы должны быть числами");
    return;
  }

  for (let i = n1 % 2 == 0 ? n1 : n1 - 1, count = 1; i <= n2; i++) {
    for (let j = 2; j <= i; j++) {
      if (i % j === 0 && j < i) {
        break;
      } else if (j === i) {
        isValid = true;
        switch (true) {
          case count === 1:
            console.log(colors.green(i));
            count++;
            break;
          case count === 2:
            console.log(colors.yellow(i));
            count++;
            break;
          case count === 3:
            console.log(colors.red(i));
            count = 1;
            break;
        }
      }
    }
  }

  {
    !isValid && console.log("В диапазоне нет простых чисел");
  }
};

getNormalNumbers(n1, n2);
