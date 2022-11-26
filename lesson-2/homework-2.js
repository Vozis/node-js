import EventEmitter from "events";

const userDateString = process.argv.splice(2).toString();

const getDate = (userDateString) => {
  const [hour, day, month, year] = userDateString
    .split("-")
    .map((item) => +item);

  return new Date(year, month - 1, day - 1, hour, 0, 0);
};

const isTrue = (condition, type) => {
  if (condition) {
    return `${condition} ${type}, `;
  }
  return "";
};

const emitter = new EventEmitter();
const endDate = getDate(userDateString);

const timerStart = (endDate) => {
  const currentDate = new Date();
  const isTimerEnd = endDate - currentDate;

  if (isTimerEnd <= 0) {
    emitter.emit("timerEnd");
  } else {
    const timeLeft = new Date(isTimerEnd);
    const res = `${isTrue(timeLeft.getUTCFullYear() - 1970, "year")} ${isTrue(
      timeLeft.getUTCMonth(),
      "month",
    )} ${isTrue(timeLeft.getUTCDate(), "days")} ${isTrue(
      timeLeft.getUTCHours(),
      "hour",
    )} ${isTrue(timeLeft.getUTCMinutes(), "minutes")} ${isTrue(
      timeLeft.getUTCSeconds(),
      "seconds",
    )}.`;

    console.clear();
    console.log(res);
  }
};

const timer = setInterval(() => {
  emitter.emit("timerStart", endDate);
}, 1000);

const timerEnd = (timer) => {
  clearInterval(timer);
  console.log("timer end");
};

emitter.on("timerStart", timerStart);
emitter.on("timerEnd", () => {
  timerEnd(timer);
});
