import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
  $('.employee-compensation').css('width', '50%');
  $('#showAll').click(function () {
    $('.hidden-cards').removeClass('no-show');
    $(this).addClass('no-show');
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

  function appendIcons(data) {
    // setting up the ratios
    const medianemployees = data.employeeratio / 10;
    const employeecompensation = (data.medianpay / maxEmployee ) * 100;
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

  let maxEmployee = 0;

  function findMax(data) {
    for (let i = 0; i < data.length; i += 1) {
      // data[i].id = i;
      data[i].class = i;
      if (data[i].medianpay >= maxEmployee) {
        maxEmployee = data[i].medianpay;
      }
    }
    drawCards(data);
    appendIcons(data);
    assignCat(data);
  }

  function assignCat(data){
    console.log(data); 
  }
  function drawCards(data) {

    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    let employeeCompensation;
    const teacherCompensation = maxEmployee / 52000;
    const policeCompensation = maxEmployee / 65956;

    const ceos10 = data.slice(0, 10);
    const ceosRest = data.slice(10, 102);
    const ceos = data;

    // for (let i = 0; i < ceos.length; i+=1){
    //   const fifteenMil = ceos[i].ceopay <= 15000000;
    //   console.log(ceos[i].company + ' is ' + fifteenMil + ' ' + ceos[i].ceopay);
    // }


    $.each(ceos10, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);

      appendIcons(v);
    });

    $.each(ceosRest, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.hidden-cards').append(cardHTML);

      appendIcons(v);
    });
  } // function drawCArds
  $.ajax({
    url: 'https://interactives.dallasnews.com/data-store/2018/2018-06-ceo-pay-tracker.json',
    cache: false,
    success: findMax,
    dataType: 'json',
  });
});
