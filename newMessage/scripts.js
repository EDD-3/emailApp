$.extend($.validator.messages,{
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

$(document).ready(function(){
    getUserId();
    getUserEmail();
    setupValidation();
    getDropContacts();
    $('#addMessage').click(() => {
        addMessage();
        $('#message').val('');
    });

    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });

    $(".btn-danger").click(() => {
        getUserEmail();
        messages = [];
    });  
});

let user_id;
let messages = [];

const filterReceivers = (rows) => {
return rows.filter( row => row.id !== user_id );}

function getDropContacts(){
    $.post('../login/main.php',{method:'get'},function(e){
        var datosDrop = [];
        let values = filterReceivers(e);
        $.each(values,function(index,value){
            var obj = {
                id:value.id,
                text:value.username
            };
            datosDrop.push(obj);
        });

        $('#foremail').select2({
            placeholder: 'Seleccione una persona',
            data:datosDrop,
            theme: "bootstrap4",
            width: 'element'
        });
    });
}


const getUsername = () => {
    $.post('../login/main.php',{method:'getUsername'},function(data){
        
    });
}

const getUserEmail = () => {
    $.post('../login/main.php',{method:'getUserEmail'},function(data){
        $("#email").val(data);
    });
}

const getUserId = () => {
    $.post('../login/main.php',{method:'getUserId'},function(data){
        user_id = data;
    });
}

const createMessage = (body) => {
    return {
        body: body
    }
}

const addMessage = () => {
    const $messageBody = $('#message').val();
    messages.push(createMessage($messageBody))
    console.log(messages);

};

function addData(){
    let forContacts = $('#foremail').val();
    forContacts = forContacts.join(', ');

    console.log(forContacts);
    var newRow = {
        'to_id': forContacts,
        'from_id': user_id,
        'subject':$('#subject').val(),
    }
    console.log(newRow);

    $.post('main.php',{method:'insert',data:newRow,messages:messages},function(e){
        
        $('#frm')[0].reset();
        getUserEmail();
        messages = [];
    });
}

var data = [];

var columns = [{
    title: 'Nombre',
    data: 'name'
},
{
    title: 'Genero',
    data: 'gender'
},
{
    title: 'Modelo de computadora',
    data: 'model'
},
{
    title: 'Marca de computadora',
    data: 'brand'
},
{
    title: 'Acciones',
    data:'id',
    render: function(e){
        return '<button type="button" onclick="deleteData('+e+')" class="btn btn-danger"><i class="fas fa-trash"></i></button>' + '<button type="button" onclick="editRow('+e+')" class="btn btn-success"><i class="fas fa-edit"></i></button>';
    }
}
];

function setDataTable(data){
    $('#tbl').DataTable({
        dom: 'Bfrtip',
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

function setupValidation(){
    $('#frm').validate({
        rules:{
            email:{
                required:true
            },
            foremail: {
                required:true
            },
            subject: {
                required:true
            }
        },
        submitHandler: function(form){
            addData();
        },
        invalidHandler:function(form){
            $.notify({
                // options
                message: 'Introduce bien los datos' 
            },{
                // settings
                type: 'danger'
            });
        }
    });
}
