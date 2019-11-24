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
  
    getUsername();
    getUserEmail();
    getUserId();
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
});

let user_id;

const filterReceivers = (rows) => rows.filter( row => row.id !== user_id );

function getDropPerson(){
    $.post('../persons/main.php',{method:'get'},function(e){
        var datosDrop = [];
        values = e;
        $.each(e,function(index,value){
            var obj = {
                id:value.id,
                text:value.name
            };
            datosDrop.push(obj);
        });

        $('#person').select2({
            placeholder: 'Seleccione una persona',
            data:datosDrop,
            theme: "bootstrap4",
            width: 'element'
        });
    });
}


const getUsername = () => {
    $.post('../loginUI/main.php',{method:'getUsername'},function(data){
        $("#name").text(data);
    });
}

const getUserEmail = () => {
    $.post('../loginUI/main.php',{method:'getUserEmail'},function(data){
        $("#email").val(data);
    });
}

const getUserId = () => {
    $.post('../loginUI/main.php',{method:'getUserId'},function(data){
        user_id = data;
    });
}

function addData(){
    var newRow = {
        'person_id':$('#person').val(),
        'observation':$('#obs').val(),
        'cpu_id':$('#cpu').val()
    }
    console.log(newRow);

    $.post('main.php',{method:'insert',data:newRow},function(e){
        
        getData();
        $('#frm')[0].reset();
    });
}

function deleteData(id){
    $.post('main.php',{method:'delete',data:{id:id}},function(e){
        getData();
    });
}

function editRow(id){
    editId = id;
    $.post('main.php',{method:'show',data:{id:id}},function(e){
        console.log(e);
        $('#Eperson').val(e[0].person_id);
        $('#Ecpu').val(e[0].cpu_id);
        $('#Eobs').val(e[0].observation);
        $('#editModal').modal();
        setupModalValidation();
    });
    
}

function updateData() {
    var newRow = {
        'id':editId,
        'person_id':$('#Eperson').val(),
        'observation':$('#Eobs').val(),
        'cpu_id':$('#Ecpu').val()
    }
    
    $.post('main.php',{method:'update',data:newRow},function(e){
        console.log(newRow);
        $('#editModal').modal('toggle');
        getData();
        $.notify({
            // options
            message: 'Datos actualizados con éxito' 
        },{
            // settings
            type: 'success'
        });
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
            person:{
                required:true
            },
            obs: {
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

function setupModalValidation(){
    $('#Efrm').validate({
        rules:{
            Eperson:{
                required:true
            },
            Eobs: {
                required:true
            }

        },
        submitHandler: function(form){
            updateData();
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