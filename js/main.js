$(document).ready(function () {

    var source = $('#calendar-template').html();        // Leggiamo il template vuoto e lo associamo ad una variabile
    var templateGiorno = Handlebars.compile(source);    // Compiliamo il template e lo associamo ad una variabile

    var mese = 0;                                       // Associamo il mese 0 (Gennaio) ad una variabile
    var dataIniziale = moment('2018-01-01')             // Facciamo una fotografia (una data di partenza) del calendario e lo associamo ad una variabile
    //console.log(dataIniziale);
    stampaGiorniMese(dataIniziale);                     // Eseguiamo la funzione con dataIniziale in ingresso

    $('.mese-succ').click(function () {                 // Al click parte la funzione
        if (mese != 11) {                               // Viene eseguita soltanto se mese è diverso da 11
            dataIniziale.add(1, 'month');               // Viene incrementato il mese di + 1
            stampaGiorniMese(dataIniziale);             // 
            mese = mese + 1;
            stampaFestivi(mese);
        }
    });

    $('.mese-prec').click(function () {
        if (mese != 0) {
            dataIniziale.subtract(1, 'month');
            stampaGiorniMese(dataIniziale);
            mese = mese - 1;
            stampaFestivi(mese);
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
        //console.log(nomeMese);
        $('#nome-mese').text(nomeMese);
        for (var i = 1; i <= giorniMese; i++) {
            //$('#calendar').append('<li>' + i + ' ' + nomeMese + '</li>')
            var giornoDaInserire = {
                day: i + ' ' + nomeMese,
                dataDay: standardDay.format('YYYY-MM-DD')
            }
            var templateFinale = templateGiorno(giornoDaInserire);
            $('#calendar').append(templateFinale);
            standardDay.add(1, 'day');
        }
    }

});
