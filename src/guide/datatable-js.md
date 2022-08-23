# Guia y ejemplos Datatable js jquery
---


- Crear un callback para manipular la columna 5

```js
$(function () {
    $.fn.dataTable.moment('DD-MM-YYYY');
    var table = $("#tbl-sesiones").DataTable({
        language: {
            url: '//cdn.datatables.net/plug-ins/1.10.12/i18n/Spanish.json'
        },
        "ajax": {
            "url": "GetSesiones",
            "dataType": "JSON",
            "type": "POST"
        },
        "pageLenght": 100,
        "order": [[1, "asc"]],
        columns: [
            { "data": "Id" },
            { "data": "_Fecha" },
            { "data": "_HoraInicio" },
            { "data": "_HoraTermino" },
            { "data": "_TipoSesion" },
            {
                "data": "_EstadoCalculado",
                "targets": 5,
                "render": function (data, type, row) {
                    return data === "SinRegistrar" ? "Sin Registrar" : data
                }
            },
            { "data": "Presentes" },
            { "data": "Ausentes" },
            { "data": "Justificados" },
            {
                "data": null,
                "targets": -1,
                "render": function (data, type, row) {
                    if ((data.Id == 0) && ($("#PuedeCrear").val())) {
                        return "<a href='#' class='btn btn-success btn-xs btn-create-sesion'>Crear</a>";
                    }
                    else if ($("#PuedeEliminar").val()) {
                        return "<a href='#' class='btn btn-info btn-xs btn-view-sesion'>Ver</a> &nbsp;<a href='#' class='btn btn-danger btn-xs btn-delete-sesion'>Eliminar</a>";
                    }
                    else if ($("#PuedeVer").val()) {
                        return "<a href='#' class='btn btn-info btn-xs btn-view-sesion'>Ver</a>";
                    }
                }
            },
        ],
        rowCallback: function (row, data) {
            data._EstadoCalculado === "SinRegistrar" ? row.style.background = "#FFE0E5" : 'white';
        }
    });
}
```

- Hacer click en una fila de un datatable

```js
    $("#tbl-encuestaDocente").on("click", ".filaBtn", function () {
        var data = table.row($(this)).data();
        var periodoAcademicoId = data.Id;
        $.ajax({
            method: "POST",
            url: "GotoVersionesEncuestaDocente",
            dataType: "json",
            async: false,
            data: {
                periodoAcademicoId: periodoAcademicoId
            },
            success: function (result) {
                if (result.returnValue == "OK") {
                    window.top.location.href = ("/WebForms/DrillDown/DrillDown.aspx");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //toastr["error"]("Ver Unidad Academica AJAX Error:" + thrownError);
                window.top.location.href = ("/WebForms/DrillDown/DrillDown.aspx");
            }
        });
    });
```