import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  $('.employee-compensation').css('width', '50%');
  $('#showAll').click(function(){
    $(this).addClass('no-show');
    $('.cards').removeClass('hider');
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
  let maxEmployee = 0;

  function appendIcons(data) {
    // setting up the ratios
    const medianemployees = data.employeeratio / 10;
    const employeecompensation = (data.medianpay / maxEmployee) * 100;
    const teachercompensation = (52000 / maxEmployee) * 100;
    const policecompensation = (65956 / maxEmployee) * 100;

    // apending icons and chart bars
    for (let i = 0; i < medianemployees; i += 1) {
      $('<i class="fas fa-user"></i>').appendTo($(`#card-${data.class} .employee`));
    }

    $(`#card-${data.class} .employee-bar`).css('width', `${employeecompensation}%`);

    $(`#card-${data.class} .teacher-bar`).css('width', `${teachercompensation}%`);

    $(`#card-${data.class} .police-bar`).css('width', `${policecompensation}%`);
  } // function appendIcons

  function findMax(data) {
    for (let i = 0; i < data.length; i += 1) {
      // data[i].id = i;
      data[i].class = i;
      if (data[i].medianpay >= maxEmployee) {
        maxEmployee = data[i].medianpay;
      }

      // assigning ceopay attributes
      if (data[i].ceopay <= 1000000) {
        data[i].ceo = 'one';
      } if (data[i].ceopay >= 1000000 && data[i].ceopay <= 5000000) {
        data[i].ceo = 'five';
      } if (data[i].ceopay >= 5000000 && data[i].ceopay <= 10000000) {
        data[i].ceo = 'ten';
      } if (data[i].ceopay >= 10000000 && data[i].ceopay <= 15000000) {
        data[i].ceo = 'fifteen';
      } if (data[i].ceopay >= 15000000 && data[i].ceopay <= 20000000) {
        data[i].ceo = 'twenty';
      } if (data[i].ceopay >= 20000000) {
        data[i].ceo = 'twentyplus';
      }

      // assigning median pay attribute
      if (data[i].medianpay <= 50000) {
        data[i].employee = 'fifty';
      } if (data[i].medianpay >= 50000 && data[i].medianpay <= 1000000) {
        data[i].employee = 'onehundred';
      } if (data[i].medianpay >= 100000 && data[i].medianpay <= 2000000) {
        data[i].employee = 'twohundred';
      } if (data[i].medianpay >= 200000) {
        data[i].employee = 'twohundredplus';
      }
    } // for loop
    drawCards(data);
    appendIcons(data);

    $('.filter-cat-results .f-cat').addClass('active');
  }


  function drawCards(data) {
    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    const ceos10 = data.slice(0, 10);
    const ceosRest = data.slice(10, 102);
    const ceos = data;

    $.each(ceos, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);

      appendIcons(v);
    });

    // $.each(ceos10, (k, v) => {
    //   const cardHTML = cardTemplate(v);
    //   $('.cards').append(cardHTML);
    //
    //   appendIcons(v);
    // });
    //
    // $.each(ceosRest, (k, v) => {
    //   const cardHTML = cardTemplate(v);
    //   $('.hidden-cards').append(cardHTML);
    //
    //   appendIcons(v);
    // });
  } // function drawCArds


  function filterCategory(cat1, cat2, cat3) {
     // reset results list
    $('.filter-cat-results .f-cat').removeClass('active');

    // the filtering in action for all criteria
    let selector = '.f-cat';

    if (cat1 !== 'cat-all') {
      selector = `[data-cat=${cat1}]`;
    }
    if (cat2 !== 'cat-all') {
      selector = `${selector}[data-cat2=${cat2}]`;
    }
    // if (cat3 !== 'cat-all') {
    //   selector = selector + '[data-cat3=' + cat3 + ']';
    // }

    // show filter results
    $(selector).addClass('active');
    console.log(selector);
  }
  // start by showing all items
  $('.filter-cat-results .f-cat').addClass('active');

    // call the filtering function when selects are changed
  $('.filtering select').change(function () {
    filterCategory($('.filtering select.cat1').val(), $('.filtering select.cat2').val(), $('.filtering select.cat3').val());

    $('.cards').removeClass('hider');
    $('#showAll').addClass('no-show');
  });

  $.ajax({
    url: 'https://interactives.dallasnews.com/data-store/2018/2018-06-ceo-pay-tracker.json',
    cache: false,
    success: findMax,
    dataType: 'json',
  });
});
