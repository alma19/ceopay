import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  // CHANGES
  // let's just hide this with display: none in the css initially
  // $('.hidden-cards').hide();

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

  // CHANGES
  // helper function to return multiple images for companies that have multiple ceos

  handlebars.registerHelper('multipleImages', (imagepath, ceonames) => {
    console.log('multipleImages:', imagepath, ceonames);

    const imagePaths = imagepath.split(';');
    const ceoNames = ceonames.split(' and ');
    console.log(imagePaths, ceoNames);

    let multiImageMarkup = '';
    for (let i = 0; i < imagePaths.length; i += 1) {
      multiImageMarkup += `<img class='ceo-pic' src='images/headshots/${imagePaths[i]}.jpg' alt='${ceonames[i]}' />`;
    }
    console.log(multiImageMarkup);
    return new handlebars.SafeString(multiImageMarkup);
  });

  HandlebarsIntl.registerWith(handlebars);

  const cardSource = document.getElementById('ceo-card-template').innerHTML;
  const cardTemplate = handlebars.compile(cardSource);

  // CHANGES
  // let's use the DRY principle here and create a function that appends our icons
  // so we can use it in both places

  function appendIcons(ceo) {
    // setting up the ratios
    const medianemployees = ceo.employeeratio / 10;
    const medianteachers = Math.round((ceo.ceopay / 52000) / 10);
    const medianpolice = Math.round((ceo.ceopay / 42548) / 10);

    // appending icons for median employee ratio
    for (let i = 0; i < medianemployees; i += 1) {
      $('<i class="fas fa-user"></i>').appendTo($(`#card-${ceo.id} .employee`));
      // console.log(v.ceoname + ' ' + medianteachers);
    }

    // appending icons for median teachers ratio
    for (let i = 0; i < medianteachers; i += 1) {
      $('<i class="fas fa-user-graduate"></i>').appendTo($(`#card-${ceo.id} .teacher`));
        // console.log(v.ceoname + ' ' + medianteachers);
    }

    for (let i = 0; i < medianpolice; i += 1) {
      $('<i class="fas fa-user-shield"></i>').appendTo($(`#card-${ceo.id} .police`));
      // console.log(v.ceoname + ' ' + medianpolice);
    }
  }

  function drawCards(data) {
    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    for (let i = 0; i < data.length; i += 1) {
      data[i].id = i;
    }

    const ceos = data;
    const ceos10 = data.splice(0, 10);

    console.log(ceos10);
    console.log(ceos);

    $.each(ceos10, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);

      appendIcons(v);
    });

    $.each(ceos, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.hidden-cards').append(cardHTML);

      appendIcons(v);
    });
  }
  $.ajax({
    url: 'https://interactives.dallasnews.com/data-store/2018/2018-06-ceo-pay-tracker.json',
    cache: false,
    success: drawCards,
    dataType: 'json',
  });
});