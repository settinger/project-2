// Render a list of options as a sequence of radio buttons, where the radio button value is a number (not the option text)
'use strict';

const makeRadioSurvey = (options) => {
  let formHTML = ``;
  for (let i=0; i<options.length; i++) {
    let option = options[i];
    formHTML += `<div><input type="radio" id="${i}" value="${i}" name="surveyresult"><label for="${i}">${option}</label></div>\n`;
  }
  return formHTML;
}

module.exports = makeRadioSurvey;