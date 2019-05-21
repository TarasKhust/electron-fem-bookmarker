const os = require('os');
const fs = require('fs');
const {shell, remote} = require('electron');
const systemPreferences = remote.systemPreferences;

const newLinkUrl = document.querySelector('#new-link-url');
const newLinkSubmit = document.querySelector('.new-link-form--submit');
const newLinkForm = document.querySelector('.new-link-form');
const linkTemplate = document.querySelector('#link-template');
const linkSection = document.querySelector('.links');

linkSection.addEventListener('click', () => {
	event.target.href ? event.preventDefault() : null;
	shell.openExternal(event.target.href);
});

newLinkUrl.addEventListener('keyup', () => {
	newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

const parser = new DOMParser();
const parserResponse = (text) => parser.parseFromString(text, 'text/html');
const findTitle = (nodes) => nodes.querySelector('title').textContent;

const addToPage = ({title, url}) => {
	const newLink = linkTemplate.content.cloneNode(true);
	const titleElement = newLink.querySelector('.link--title');
	const urlElement = newLink.querySelector('.link--url');

	titleElement.textContent = title;
	urlElement.href = url;
	urlElement.textContent = url;
	linkSection.appendChild(newLink);
	return {title, url};

};

newLinkForm.addEventListener('submit', () => {
	event.preventDefault();

	const url = newLinkUrl.value;

	fetch(url).
			then(response => response.text()).
			then(parserResponse).
			then(findTitle).
			then(title => ({title, url})).
			then(addToPage).
			then(title => console.log(title)).
			then(error => console.log(error));
});

window.addEventListener('load', () => {
	systemPreferences.isDarkMode() ? document.querySelector('link').href = 'styles-dark.css' : null;
})

const files = fs.readdirSync(os.homedir());

files.forEach((name) => {
	const file = document.createElement('li');
	file.textContent = name;
	document.body.appendChild(file);
});


