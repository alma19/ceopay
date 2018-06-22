import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  $('.hidden-cards').hide();

  $('#showAll').click(function(){
    $('.hidden-cards').show();
  });


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
    const ceos = data;
    const ceos10 = data.splice(0, 10);

    console.log(ceos10);
    console.log(ceos);

    $.each(ceos10, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);


      // setting up the ratios
      const medianemployees = v.employeeratio / 10;
      const medianteachers = Math.round((v.ceopay / 52000) / 10);
      const medianpolice = Math.round((v.ceopay / 42548) / 10);

      // appending icons for median employee ratio
      for (let i = 0; i < medianemployees; i += 1) {
        $('<i class="fas fa-user"></i>').appendTo($(`#card-${v.photo} .employee`));
        // console.log(v.ceoname + ' ' + medianteachers);
      }

      // appending icons for median teachers ratio
      for (let i = 0; i < medianteachers; i += 1) {
        $('<i class="fas fa-user-graduate"></i>').appendTo($(`#card-${v.photo} .teacher`));
          // console.log(v.ceoname + ' ' + medianteachers);
      }

      for (let i = 0; i < medianpolice; i += 1) {
        $('<i class="fas fa-user-shield"></i>').appendTo($(`#card-${v.photo} .police`));
        // console.log(v.ceoname + ' ' + medianpolice);
      }


      // first 10 div, rest are hidden
    });

    $.each(ceos, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.hidden-cards').append(cardHTML);


      // setting up the ratios
      const medianemployees = v.employeeratio / 10;
      const medianteachers = Math.round((v.ceopay / 52000) / 10);
      const medianpolice = Math.round((v.ceopay / 42548) / 10);

      // appending icons for median employee ratio
      for (let i = 0; i < medianemployees; i += 1) {
        $('<i class="fas fa-user"></i>').appendTo($(`#card-${v.photo} .employee`));
        // console.log(v.ceoname + ' ' + medianteachers);
      }

      // appending icons for median teachers ratio
      for (let i = 0; i < medianteachers; i += 1) {
        $('<i class="fas fa-user-graduate"></i>').appendTo($(`#card-${v.photo} .teacher`));
          // console.log(v.ceoname + ' ' + medianteachers);
      }

      for (let i = 0; i < medianpolice; i += 1) {
        $('<i class="fas fa-user-shield"></i>').appendTo($(`#card-${v.photo} .police`));
        // console.log(v.ceoname + ' ' + medianpolice);
      }


      // first 10 div, rest are hidden
    });
  }
  $.ajax({
    url: 'https://interactives.dallasnews.com/data-store/2018/2018-06-ceo-pay-tracker.json',
    cache: false,
    success: drawCards,
    dataType: 'json',
  });
});
