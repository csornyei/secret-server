function getModInteger(dividend, divisor) {
    return Math.floor(dividend % divisor);
}

function formattedRemainingTime(until) {
    let untilTime = until / 1000;
    let formattedText = ""
    if (untilTime > 0) {
        // seconds
        formattedText = `${getModInteger(untilTime, 60).toString().padStart(2, "0")}`
        untilTime = untilTime / 60;
    }
    if (untilTime > 0) {
        // minutes
        formattedText = `${getModInteger(untilTime, 60).toString().padStart(2, "0")}:${formattedText}`;
        untilTime = untilTime / 60;
    }
    if (untilTime > 0) {
        // hours
        formattedText = `${getModInteger(untilTime, 24).toString().padStart(2, "0")}:${formattedText}`;
        untilTime = untilTime / 24;
    }
    if (Math.floor(untilTime) > 0) {
        // days
        formattedText = `${Math.floor(untilTime)} days ${formattedText}`;
    }

    return formattedText;
}

export {
    formattedRemainingTime
}