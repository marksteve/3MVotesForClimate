import TWEEN, { Easing, Tween } from "@tweenjs/tween.js";
import {
  differenceInDays,
  differenceInSeconds,
  format,
  intervalToDuration,
  sub,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const electionStart = zonedTimeToUtc("2022-05-09", "Asia/Manila");
const registrationEnd = zonedTimeToUtc("2021-09-30 23:59:59", "Asia/Manila");

const election = document.querySelector(".election");
const electionTitle = election.querySelector(".title");
const electionTimer = election.querySelector(".timer");
const registration = document.querySelector(".registration");
const registrationTitle = registration.querySelector(".title");
const registrationTimer = registration.querySelector(".timer");

const secsOffset = {
  election: 365 * 24 * 60 * 60,
  registration: 182 * 24 * 60 * 60,
};
let introCompleted = false;

new Tween(secsOffset)
  .to(
    {
      election: differenceInSeconds(electionStart, new Date()),
      registration: differenceInSeconds(registrationEnd, new Date()),
    },
    1000
  )
  .easing(Easing.Quadratic.InOut)
  .onStart(() => {
    updateBar({ date: new Date(), end: electionStart, el: election });
    updateBar({
      date: new Date(),
      end: registrationEnd,
      el: registration,
    });
  })
  .onComplete(() => (introCompleted = true))
  .delay(1000)
  .start();

function loop(time) {
  const dates = introCompleted
    ? {
        election: new Date(),
        registration: new Date(),
      }
    : {
        election: sub(electionStart, { seconds: secsOffset.election }),
        registration: sub(registrationEnd, {
          seconds: secsOffset.registration,
        }),
      };

  renderText({
    date: dates.election,
    end: electionStart,
    title: electionTitle,
    formatTitle: (days) => `2022 ELECTIONS IN ${days} DAYS`,
    timer: electionTimer,
  });
  renderText({
    date: dates.registration,
    end: registrationEnd,
    title: registrationTitle,
    formatTitle: (days) => `VOTERS REGISTRATION ENDS IN ${days} DAYS`,
    timer: registrationTimer,
  });

  if (introCompleted) {
    updateBar({ date: dates.election, end: electionStart, el: election });
    updateBar({
      date: dates.registration,
      end: registrationEnd,
      el: registration,
    });
  }

  requestAnimationFrame(loop);
  TWEEN.update(time);
}
requestAnimationFrame(loop);

function renderText({ date, end, title, formatTitle, timer }) {
  const days = differenceInDays(end, date);
  const duration = intervalToDuration({ start: date, end });
  title.textContent = formatTitle(days);
  timer.innerHTML = `${format(end, "MMM d, yyyy")} &bull; ${formatDuration(
    days,
    duration
  )}`;
}

function formatDuration(days, duration) {
  return [days, duration.hours, duration.minutes, duration.seconds]
    .map((d) => String(d).padStart(2, "0"))
    .join(":");
}

function updateBar({ date, end, el }) {
  const days = differenceInDays(end, date);
  el.style.height = `${(days / 365) * 100}%`;
}
