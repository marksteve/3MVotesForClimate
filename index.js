import { differenceInDays, format, intervalToDuration } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

const election = document.querySelector(".election");
const electionTitle = election.querySelector(".title");
const electionTimer = election.querySelector(".timer");
const registration = document.querySelector(".registration");
const registrationTitle = registration.querySelector(".title");
const registrationTimer = registration.querySelector(".timer");

const electionStart = zonedTimeToUtc("2022-05-09", "Asia/Manila");
const registrationEnd = zonedTimeToUtc("2021-09-30 23:59:59", "Asia/Manila");

render();

function render(date = new Date()) {
  const electionDays = differenceInDays(electionStart, date);
  const registrationDays = differenceInDays(registrationEnd, date);

  const electionDuration = intervalToDuration({
    start: date,
    end: electionStart,
  });
  const registrationDuration = intervalToDuration({
    start: date,
    end: registrationEnd,
  });

  electionTitle.textContent = `2022 ELECTIONS IN ${electionDays} DAYS`;
  registrationTitle.textContent = `VOTERS REGISTRATION ENDS IN ${registrationDays} DAYS`;

  electionTimer.innerHTML = `${format(
    electionStart,
    "MMM d, yyyy"
  )} &bull; ${formatDuration(electionDays, electionDuration)}`;
  registrationTimer.innerHTML = `${format(
    registrationEnd,
    "MMM d, yyyy"
  )} &bull; ${formatDuration(registrationDays, registrationDuration)}`;

  election.style.top = `${(1 - electionDays / 365) * 100}%`;
  registration.style.top = `${(1 - registrationDays / 365) * 100}%`;

  requestAnimationFrame(() => render());
}

function formatDuration(days, duration) {
  return [days, duration.hours, duration.minutes, duration.seconds]
    .map((d) => String(d).padStart(2, "0"))
    .join(":");
}
