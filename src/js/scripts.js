import $ from 'jquery';
import handlebars from 'handlebars';


import './furniture';

const HandlebarsIntl = require('handlebars-intl');

$(document).ready(() => {
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

  function appendIcons(ceo) {
    // setting up the ratios
    const medianemployees = ceo.employeeratio / 10;
    const medianteachers = Math.round((ceo.ceopay / 52000) / 10);
    const medianpolice = Math.round((ceo.ceopay / 42548) / 10);

      // the user clicks the dropdown
      // grab all the data between 0-1,000,00
      // show that data
      // hide everything


    const oneMil = ceo.ceopay <= 1000000;
    const fiveMil = ceo.ceopay >= 1000000 && ceo.ceopay <= 5000000;
    const tenMil = ceo.ceopay >= 5000000 && ceo.ceopay <= 10000000;
    const fifteenMil = ceo.ceopay >= 10000000 && ceo.ceopay <= 15000000;
    const twentyMil = ceo.ceopay >= 15000000 && ceo.ceopay <= 20000000;

    const ceoCompensation = [oneMil, fiveMil, tenMil, fifteenMil, twentyMil];


    var filterActive;

    function filterCategory(cat1, cat2, cat3){
      // reset results publishDate
      $('.filter-cat-results .f-cat').removeClass('active');

      // the filtering in action for all criteria
      let selector = '.filtering .f-cat';
      if (cat1 !== 'cat-all'){
        selector = '[data-cat=' + cat1 + ']';
      }
      if (cat2 !== 'cat-all'){
        selector = selector + '[data-cat2=' + cat2 + ']';
      }
      if (cat3 !== 'cat-all') {
        selector = selector + '[data-cat3=' + cat3 + "]";
      }

      // show all results
      $(selector).addClass('active');

      // reset active filter
      filterActive = cat1;
    }

    // start by showing all items
    $('.filtering .f-cat').addClass('active');

    // call the filtering function when selects are changed
    $('.filtering select').change(function(){
      filterCategory($('.filtering select.cat1').val(), $('.filtering select.cat2').val(), $('.filtering select.cat3').val());
    })

    // for (let i = 0; i < 89; i += 1) {
    //   if (twentyMil === false) {
    //     $(`.card-${ceo.class}`).addClass('no-show');
    //   }
    // }
    // $('select').change(function(){
    //   let ceoFilter = $('#ceo-filter :selected').val();
    //   console.log(ceoFilter);
    //   console.log(ceoFilter === `${oneMil}`);
    //   console.log(`"${  oneMil  }"`);
    // });


    // appending icons for median employee ratio
    for (let i = 0; i < medianemployees; i += 1) {
      $('<i class="fas fa-user"></i>').appendTo($(`#card-${ceo.class} .employee`));
    }

    // appending icons for median teachers ratio
    for (let i = 0; i < medianteachers; i += 1) {
      $('<i class="fas fa-user-graduate"></i>').appendTo($(`#card-${ceo.class} .teacher`));
    }

    for (let i = 0; i < medianpolice; i += 1) {
      $('<i class="fas fa-user-shield"></i>').appendTo($(`#card-${ceo.class} .police`));
    }
  }


  function drawCards(data) {
    // CHANGES
    // lets give each row an ceo an id number that we use for the id on the card
    for (let i = 0; i < data.length; i += 1) {
      // data[i].id = i;
      data[i].class = i;
    }



    const ceos = data;
    const ceos10 = data.splice(0, 10);

    // for (let i = 0; i < ceos.length; i+=1){
    //   const fifteenMil = ceos[i].ceopay <= 15000000;
    //   console.log(ceos[i].company + ' is ' + fifteenMil + ' ' + ceos[i].ceopay);
    // }


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
