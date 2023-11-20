'use strict';
//alarm doesn't look like an English word anymore.

let alarmEnabled = false;
let hour = 0;
let minute = 0;

const hourRegex = new RegExp("^[0-1]?[0-9]$|^2[0-4]$");
const minuteRegex = new RegExp("^[0-5]?[0-9]$");

const alarmSound = new Audio("./src/audio/mixkit-morning-clock-alarm-1003.wav");
alarmSound.loop = true;

const alarm = new Alarm(0,0, alarmSound, document.querySelector(".alarm .alarm-time span"));

const alarmElement = document.querySelector(".alarm");


alarmElement.querySelector(".bx.bxs-bell, .alarm .bx.bx-bell-off").addEventListener("click", e=>{
	if (e.target.classList.contains("bxs-bell")) {
		disableAlarm(e.target);
	} else {
		enableAlarm(e.target);
	}
});

alarmElement.querySelector(".submit").addEventListener("click", e=>{
	e.preventDefault();
	let hour = e.target.parentElement.querySelector(".hour");
	let minute = e.target.parentElement.querySelector(".minute");

	if (hour.value.toString().length>2 || !hourRegex.test(hour.value.toString())) {
		hour.value = "";
		hour.focus();
		return;
	}
	if (minute.value.toString().length>2 || !minuteRegex.test(minute.value.toString())) {
		minute.value = "";
		minute.focus();
		return;
	}
	alarm.set(hour.value, minute.value);
});

function Alarm (hour, minute, sound, element = null) {
	this.hour = hour;
	this.minute = minute;

	this.sound = sound;
	this.element = element;
}

Alarm.prototype.set = function (hour, minute) {
	hour %=24; //because we allow 24 as a valid hour input, we do this to convert it back to 0.
	minute = Number(minute);
	this.hour = hour;
	this.minute = minute;

	this.element.innerHTML = `${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}`;

	enableAlarm(this.element.parentElement.parentElement.querySelector(".bx.bx-bell-off, .bx.bxs-bell"));
}

Alarm.prototype.activate = function () {
	this.sound.play();
	setTimeout(e=>{
		this.deActivate();
	}, 10000);
}

Alarm.prototype.deActivate = function () {
	this.sound.pause();
	this.sound.currentTime = 0;
}

function enableAlarm(element) {
	element.classList.remove("bx-bell-off");
	element.classList.add("bxs-bell");
	element.parentElement.classList.add("active");
	alarmEnabled = true;
}
function disableAlarm(element) {
	element.classList.remove("bxs-bell");
	element.classList.add("bx-bell-off");
	element.parentElement.classList.remove("active");
	alarmEnabled = false;
	alarm.deActivate();
}

function main(e) {
	let date = new Date();
	if (date.getMinutes()!==minute || date.getHours()!==hour) {
		timeChanged(date);
	}
}
function timeChanged(date) {
	minute = date.getMinutes();
	hour = date.getHours();
	alarmElement.querySelector(".time").innerHTML = `${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}`;

	if (alarmEnabled) {
		if (alarm.minute===minute && alarm.hour===hour) {
			alarm.activate();
		}
	}
}
//very cheap approach. Would not be viable if seconds had to be counted.
setInterval(main, 1000);
timeChanged(new Date());