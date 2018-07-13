import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');
const numeral = require('numeral');


$(document).ready(() => {
  // doesn't look like there's a selector in the html that matches this. possibly old code?:
  // $('.employee-compensation').css('width', '50%');
  $('#showAll').click(function () {
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
  let ceoSum = 0;
  let maxCeo = 0;

  // need to get an accurate count of how many ceos we have pay for to get an accurate average
  let ceoPayCount = 0;

  function appendIcons(data) {
    // setting up the ratios
    console.log(data);
    const medianemployees = data.employeeratio / 10; // employeeratio
    const employeeremainder = data.employeeratio % 10;
    // calculating the average based only on ceos who's compensation is reported
    const avg = (ceoSum / ceoPayCount);
    const avgformat = numeral(avg).format('$0,0.00');
    const ceoavg = (avg / maxCeo) * 100;
    const ceocompensation = (data.ceopay / maxCeo) * 100;

    // apending icons
    for (let i = 0; i < medianemployees; i += 1) {
      $(`<span class="last${employeeremainder} fa-stack"> <i class="fas fa-user fa-stack-1x"></i> <i class="far fa-user fa-stack-1x"></i> </span>`).appendTo($(`#card-${data.class} .employee`));
    }

    // appending charts
    $(`#card-${data.class} .ceo-bar`).css('width', `${ceocompensation}%`);
    $(`#card-${data.class} .avg-bar`).css('width', `${ceoavg}%`);

    // apend average
    $('.avg').text(avgformat);
    // top 100 avg:
  } // function appendIcons


  const ceoScale = {
    one: [0, 1000000],
    five: [1000000, 5000000],
    ten: [5000000, 10000000],
    fifteen: [10000000, 15000000],
    twenty: [15000000, 20000000],
  };

  const medianScale = {
    fifty: [0, 50000],
    onehundred: [50000, 1000000],
    twohundred: [100000, 2000000],
  };

  function checkScale(pay, scale, max) {
    let x = max;
    $.each(scale, (key, value) => {
      if (pay > value[0] && pay <= value[1]) {
        x = key;
      }
    });

    return x;
  }

  function findMax(data) {
    for (let i = 0; i < data.length; i += 1) {
      // data[i].id = i;
      data[i].class = i;
      if (data[i].ceopay >= maxCeo) {
        maxCeo = data[i].ceopay;
      }

      ceoSum += data[i].ceopay;

      // add to our ceoPayCount only if a ceo has compensation reported
      if (data[i].ceopay > 0) {
        ceoPayCount += 1;
      }

      // note, on the comparisions below, make sure to not check if the preceding comparision
      // is equal to the greater number, as you're making the same check on the next comparision
      // on the low number
      data[i].ceo = checkScale(data[i].ceopay, ceoScale, 'twentyplus');
      data[i].employee = checkScale(data[i].medianpay, medianScale, 'twohundredplus');

    } // for loop
    drawCards(data);
    appendIcons(data);

    $('.filter-cat-results .f-cat').addClass('active');
  }

  function drawCards(data) {
    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    const ceos = data;

    $.each(ceos, (k, v) => {
      const cardHTML = cardTemplate(v);
      $('.cards').append(cardHTML);

      appendIcons(v);
    });

    // search cards by ceo and company
    let options = {
      valueNames: ['ceo-name', 'company']
    };

    let ceoList = new List('ceo-list', options);

    $('#ceo-list').on('keyup', function () {
      $('.cards').removeClass('hider');
      $('#showAll').addClass('no-show');
    })

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

    if (cat3 !== 'cat-all') {
      selector = `${selector}[data-cat3=${cat3}]`;
    }

    // show filter results
    $(selector).addClass('active');
    console.log(selector);
  }
  // start by showing all items
  $('.filter-cat-results .f-cat').addClass('active');

    // call the filtering function when selects are changed
  $('.filtering select').change(() => {
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
