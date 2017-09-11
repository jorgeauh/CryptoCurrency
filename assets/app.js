(function($, undefined) {
  var baseUrl = location.protocol + '//' + location.hostname+"/cryptochallenge/";
  function getPrice(){
    $.ajax({
      type: 'get',
      dataType: "json",
      url: baseUrl + 'app/ajax.php',
      data: {type: 'price'},
      success: function(response) {
        $('.btc-exchange h2').html('1 BTC = '+response.BTC.USD+' USD');
        $('.eth-exchage h2').html('1 ETH = '+response.ETH.USD+' USD');
      }
    });
  }

  function getHistoMinute(){
    $.ajax({
      type: 'get',
      dataType: "json",
      url: baseUrl + 'app/ajax.php',
      data: {type: 'histominute'},
      success: function(response) {
        var btcTable = '';
        var ethTable = '';
        $.each(response, function (i, data) {
          if(i == 'BTC'){
            $.each(data, function (j, data) {
              btcTable += '<tr><td>'+j+'</td><td>'+data.USD.number+'</td><td>'+data.EUR.number+'</td></tr>'
            });
          }else{
            $.each(data, function (j, data) {
              ethTable += '<tr><td>'+j+'</td><td>'+data.USD.number+'</td><td>'+data.EUR.number+'</td></tr>'
            });
          }

        });
        $('#btcTable').find('tbody').html('').append(btcTable)
        $('#ethTable').find('tbody').html('').append(ethTable)
      }
    });
  }

  function getChartData(){
    $.ajax({
      type: 'get',
      dataType: "json",
      url: baseUrl + 'app/ajax.php',
      data: {type: 'graphic'},
      success: function(response) {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(function(){
          var arrayToDataTable = [];
          arrayToDataTable.push(['Time', 'BTC/USD', 'BTC/EUR', 'ETH/USD', 'ETH/EUR']);
          $.each(response, function (i, data) {
            arrayToDataTable.push([i, data.BTC.USD.number, data.BTC.EUR.number, data.ETH.USD.number, data.ETH.EUR.number]);
          });
          var data = google.visualization.arrayToDataTable(arrayToDataTable);
          var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
          chart.draw(data);
        });
        
        
      }
    });
  }

  function doTheMath(a, b, c, d, r){
    var result = 0;
    if(d){
      if(b == 'BTC'){
        if(c == 'USD'){
          result = a / r.BTC.USD;
        }else{
          result = a / r.BTC.EUR
        }
      }else{
        if(c == 'USD'){
          result = a / r.ETH.USD
        }else{
          result = a / r.ETH.EUR
        }
      }
    }else{
      if(b == 'BTC'){
        if(c == 'USD'){
          result = a * r.BTC.USD;
        }else{
          result = a * r.BTC.EUR
        }
      }else{
        if(c == 'USD'){
          result = a * r.ETH.USD
        }else{
          result = a * r.ETH.EUR
        }
      }
    }
    return result;
  }

  function calculator(){
    $('#currencyCalculator input[type=number]:first').on('change', function(e){
      var toConvert = $(this).val();
      var cryptoCurr = $('#cryptoCurr').val()
      var realCurr = $('#realCurr').val()
      $.ajax({
        type: 'get',
        dataType: "json",
        url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,EUR&extraParams=cryptocurrencychallenge',
        success: function(response) {
          $('#currencyCalculator').find('input[type=number]:last').val(doTheMath(toConvert, cryptoCurr, realCurr, false, response));
        }
      });
    });
    $('#currencyCalculator input[type=number]:last').on('change', function(e){
      var toConvert = $(this).val();
      var cryptoCurr = $('#cryptoCurr').val()
      var realCurr = $('#realCurr').val()
      $.ajax({
        type: 'get',
        dataType: "json",
        url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,EUR&extraParams=cryptocurrencychallenge',
        success: function(response) {
          $('#currencyCalculator').find('input[type=number]:first').val(doTheMath(toConvert, cryptoCurr, realCurr, true, response));
        }
      });
    });
    $('#cryptoCurr').on('change', function(e){
      var toConvert = $('#currencyCalculator input[type=number]:first').val();
      var cryptoCurr = $(this).val()
      var realCurr = $('#realCurr').val()
      $.ajax({
        type: 'get',
        dataType: "json",
        url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,EUR&extraParams=cryptocurrencychallenge',
        success: function(response) {
          $('#currencyCalculator').find('input[type=number]:last').val(doTheMath(toConvert, cryptoCurr, realCurr, false, response));
        }
      });
    });
    $('#realCurr').on('change', function(e){
      var toConvert = $('#currencyCalculator input[type=number]:last').val();
      var cryptoCurr = $('#cryptoCurr').val()
      var realCurr = $(this).val()
      $.ajax({
        type: 'get',
        dataType: "json",
        url: 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD,EUR&extraParams=cryptocurrencychallenge',
        success: function(response) {
          $('#currencyCalculator').find('input[type=number]:first').val(doTheMath(toConvert, cryptoCurr, realCurr, true, response));
        }
      });
    }); 
  }

  function init(){
    getHistoMinute();
    getPrice();
    getChartData()
  }

  $(function() {
    init();
    setInterval(function(){ 
      init();
    }, 10000);
    calculator();

  });
})(jQuery);