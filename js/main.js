$(document).ready(function () {

    var source = $('#calendar-template').html();        // Leggiamo il template vuoto e lo associamo ad una variabile
    var templateGiorno = Handlebars.compile(source);    // Compiliamo il template e lo associamo ad una variabile


    var dataIniziale = moment('2018-01-01')             // Facciamo una fotografia (una data di partenza) del calendario e lo associamo ad una variabile

    stampaGiorniMese(dataIniziale);                     // Eseguiamo la funzione con dataIniziale in ingresso e quindi con Gennaio come mese predefinito
    stampaFestivi(dataIniziale.month());                // Eseguiamo la funzione con soltanto il mese di dataIniziale in ingresso e quindi con le festività di Gennaio come predefinite


    $('.mese-succ').click(function () {                 // Al click parte la funzione
        if (dataIniziale.month() != 11) {               // Viene eseguita soltanto se mese è diverso da 11 in modo tale da non superare Dicembre 2018
            dataIniziale.add(1, 'month');               // Viene incrementato il mese di 1
            stampaGiorniMese(dataIniziale);             // Richiamiamo la funzione con dataIniziale come parametro
            stampaFestivi(dataIniziale.month());        // Richiamiamo la funzione con soltanto il mese come parametro
        }
    });

    $('.mese-prec').click(function () {                 // Al click parte la funzione
        if (dataIniziale.month() != 0) {                // Viene eseguita soltanto se mese è diverso da 0 in modo tale da non visualizzare il 2017
            dataIniziale.subtract(1, 'month');          // Viene decrementato il mese di 1
            stampaGiorniMese(dataIniziale);             // Richiamiamo la funzione con dataIniziale come parametro
            stampaFestivi(dataIniziale.month());        // Richiamiamo la funzione con mese come parametro
        }
    });

    function stampaFestivi(mese) {
        $.ajax({
            url: 'https://flynn.boolean.careers/exercises/api/holidays',
            method: 'GET',
            data: {
                year: 2018,
                month: mese
            },
            success: function (data) {
                //console.log(data);
                var giorniFestivi = data.response;
                for (var i = 0; i < giorniFestivi.length; i++) {
                    var giornoFestivo = giorniFestivi[i];
                    //console.log(giornoFestivo);
                    var nomeFestivo = giornoFestivo.name;
                    var dataFestivo = giornoFestivo.date;
                    //console.log(nomeFestivo);
                    //console.log(dataFestivo);
                    $('#calendar li[data-day="' + dataFestivo + '"]').addClass('festivo').append(' - ' + nomeFestivo);
                }
            }
        });
    }

    function stampaGiorniMese(meseDaStampare) {
        $('#calendar').empty();
        var standardDay = meseDaStampare.clone();
        var giorniMese = meseDaStampare.daysInMonth();
        //console.log(giorniMese);
        var nomeMese = meseDaStampare.format('MMMM');
        var numeroGiorno = meseDaStampare.startOf('month').weekday();
        //console.log(numeroGiorno);
        for (var i = 0; i < numeroGiorno; i++) {
            $("#calendar").prepend('<li></li>');
        }
        //console.log(nomeMese);
        $('#nome-mese').text(nomeMese);
        for (var i = 1; i <= giorniMese; i++) {
            //$('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>')

            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD'),
                dataWeek: standardDay.weekday()
            }

            if (giornoDaInserire.dataWeek == 6) {
                $('#calendar li[data-week="' + giornoDaInserire.dataWeek + '"]').addClass('domenica');
            }

            var templateFinale = templateGiorno(giornoDaInserire);
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }

});
