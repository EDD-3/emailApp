$.extend($.validator.messages, {
    required: "El campo es obligatorio",
    remote: "Please fix this field.",
    email: "Ingresa un correo electrónico válido.",
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

$(document).ready(function(){
    $('#frm').validate({
        rules:{
            email:{
                required:true,
                email:true
            },
            password:{
                required:true,
                minlength: 6
            }
            
        },
        submitHandler:function(frm){
            login();
        }
    });
});

function login() {
    var data = {
        email: $('#inputEmail').val(),
        password: $('#inputPassword').val()

    }
    $.post('main.php', {
        method: 'login',
        data: data
    }, function (e) {
        console.log(e);
        if (e.data) {
                    window.location.replace('../inbox');
        } else {
            $.notify({
                message:'Inicio de sesión incorrecto'
            },{
                type:'danger'
            });
        }
        $('#frm')[0].reset();
    });
}