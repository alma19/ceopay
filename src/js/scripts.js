import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  handlebars.registerHelper('namePossessive', (name) => {
    const lastLetter = name.slice(-1);
    if (lastLetter === 's' || lastLetter === 'z') {
      return `${name}'`;
    }
    return `${name}'s`;
  });

  HandlebarsIntl.registerWith(handlebars);

  const cardSource = document.getElementById('ceo-card-template').innerHTML;
  const cardTemplate = handlebars.compile(cardSource);

  function drawCards(data) {
    const ceos = data.splice(0, 100);
    // 0,10
    $.each(ceos, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);

      const medianemployees = v.employeeratio / 10;
      const medianteachers = Math.round((v.ceopay / 52000) / 10);
      const medianpolice = Math.round((v.ceopay / 42548) / 10);

      // appending icons for median employee ratio
      for (var i = 0; i < medianemployees; i++){
        $(`<i class="fas fa-user"></i>`).appendTo($(`#card-${v.photo} .employee`));
        // console.log(v.ceoname + ' ' + medianteachers);
      }

      // appending icons for median teachers ratio
      for (var i = 0; i < medianteachers; i++){
          $(`<i class="fas fa-user-graduate"></i>`).appendTo($(`#card-${v.photo} .teacher`));
          // console.log(v.ceoname + ' ' + medianteachers);
      }

      for (var i = 0; i < medianpolice; i++){
          $(`<i class="fas fa-user-shield"></i>`).appendTo($(`#card-${v.photo} .police`));
        // console.log(v.ceoname + ' ' + medianpolice);
      }



      // first 10 div, rest are hidden

      // give class for employee, teacher, police icons
      // for each ratio, divide by 10. take that number and do for loop, append an icon to the div for every number. need to include photo id
      // make sure it's appending to the div in the spefic card, not all of them
    });
  }
  $.ajax({
    url: 'https://interactives.dallasnews.com/data-store/2018/2018-06-ceo-pay-tracker.json',
    cache: false,
    success: drawCards,
    dataType: 'json',
  });
});
