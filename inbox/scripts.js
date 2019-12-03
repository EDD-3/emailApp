$.extend($.validator.messages, {
    required: "El campo es obligatorio",
    remote: "Please fix this field.",
    email: "Wrong email.",
    url: "Please enter a valid URL.",
    date: "Fecha inválida",
    dateISO: "Please enter a valid date (ISO).",
    number: "El campo debe ser numérico",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    maxlength: $.validator.format("Ingresar menos de {0} caracteres."),
    minlength: $.validator.format("Ingresa al menos {0} caracteres."),
    rangelength: $.validator.format("Usa un valor en el rango {0} y {1} "),
    range: $.validator.format("Please enter a value between {0} and {1}."),
    max: $.validator.format("Please enter a value less than or equal to {0}."),
    min: $.validator.format("Please enter a value greater than or equal to {0}.")
})

let data = [];
let user_id;
let columns = [{
        title: 'Asunto',
        data: 'subject'
    },
    {
        title: 'Remitente',
        data: 'email'
    },
    {
        title: 'Fecha',
        data: 'date_time',
        render: (date_time) => {
            moment.locale('es');
            moment(date_time).locale(false);
            return moment(date_time).format('MMMM Do YYYY');
        }
    },
    {
        title: 'Acciones',
        data: 'body',
        render:  (e) => {
            return '<button type="button" onclick="showBody(\''+ e +'\')" class="btn btn-danger">Ver</button>';
        }
    }
];

$(document).ready(function () {
    getUserId();
    getEmails();
    $("#formBody").hide();
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $(".btn-danger").mouseleave(() => {
        $("#formBody").fadeToggle("fast");
    });

});

const filterEmails = (rows) => {
    let data = [];
    rows.forEach(row => {
        if (searchForId(row.to_id.split(', '))) {
            data.push(row);
        }
    });
    return data;
}


const searchForId = arr => arr.some(id => id === user_id);

const getUsername = () => {
    $.post('../login/main.php', {
        method: 'getUsername'
    }, function (data) {

    });
}

const getUserEmail = () => {
    $.post('../login/main.php', {
        method: 'getUserEmail'
    }, function (data) {
        $("#email").val(data);
    });
}

const getUserId = () => {
    $.post('../login/main.php', {
        method: 'getUserId'
    }, function (data) {
        user_id = data;
    });
}

const getEmails = () => {
    $.post('main.php', {
        method: 'get'
    }, emails => {
        console.log(typeof emails[0].body);
        if (emails.length) {
            setDataTable(filterEmails(emails));
        }
    });
}

function showBody (message) {
    $("#formBody").fadeToggle('fast');
    $("#message").val(message);

}

function setDataTable(data) {
    $('#inbox').DataTable({
        dom: 'ft',
        data: data,
        columns: columns,
        destroy: true,

        language: {
            url: '../json/es.json'
        },

        buttons: [
            'excel', 'pdf'
        ]
    });
}