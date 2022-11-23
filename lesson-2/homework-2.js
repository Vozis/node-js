const userDateString = process.argv.splice(2).toString();
const [hour, day, month, year] = userDateString.split("-").map((item) => +item);

const isTrue = (condition, type) => {
  if (condition) {
    return `${condition} ${type}, `;
  }
  return "";
};

const createTimer = () => {
  const endDate = new Date(year, month - 1, day - 1, hour, 0, 0);

  const timer = setInterval(() => {
    const currentDate = new Date();
    const isTimerEnd = endDate - currentDate;

    // console.log(timeLeft);
    if (isTimerEnd <= 0) {
      console.log("timer end");
      clearInterval(timer);
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

      console.log(res);
    }
  }, 1000);
};

createTimer();
