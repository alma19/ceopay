import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  $('#showAll').click(function () {
    $('.hidden-cards').removeClass('no-show');
    $(this).addClass('no-show');
  });

  // if (ceo.ceopay <= 1000000) {
  //   console.log(ceo.ceopay + " ceo pay is less than 1 mil");
  // } else {
  //   $(`.card-${ceo.class}`).addClass('no-show');
  //   console.log(ceo.ceopay + " ceo pay is more than 1 mil");
  // }


  // $('#ceo-sort').change(function(){
  //
  // })

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
    // console.log('multipleImages:', imagepath, ceonames);

    const imagePaths = imagepath.split(';');
    const ceoNames = ceonames.split(' and ');
    // console.log(imagePaths, ceoNames);

    let multiImageMarkup = '';
    for (let i = 0; i < imagePaths.length; i += 1) {
      multiImageMarkup += `<img class='ceo-pic' src='images/headshots/${imagePaths[i]}.jpg' alt='${ceonames[i]}' />`;
    }
    // console.log(multiImageMarkup);
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





    // if (ceo.ceopay <= 1000000) {
    //   console.log(ceo.ceopay + " ceo pay is less than 1 mil");
    // } else {
    //   $(`.card-${ceo.class}`).addClass('no-show');
    //   console.log(ceo.ceopay + " ceo pay is more than 1 mil");
    // }

      // the user clicks the dropdown
      // grab all the data between 0-1,000,00
      // show that data
      // hide everything




    // appending icons for median employee ratio
    for (let i = 0; i < medianemployees; i += 1) {
      $('<i class="fas fa-user"></i>').appendTo($(`#card-${ceo.id} .employee`));
    }

    // appending icons for median teachers ratio
    for (let i = 0; i < medianteachers; i += 1) {
      $('<i class="fas fa-user-graduate"></i>').appendTo($(`#card-${ceo.id} .teacher`));
    }

    for (let i = 0; i < medianpolice; i += 1) {
      $('<i class="fas fa-user-shield"></i>').appendTo($(`#card-${ceo.id} .police`));
    }

    };


  function drawCards(data) {
    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    for (let i = 0; i < data.length; i += 1) {
      // data[i].id = i;
      data[i].class = i;
    }


    const ceos = data;
    const ceos10 = data.splice(0, 10);



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
