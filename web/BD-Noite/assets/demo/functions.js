function get_keys(jsonData) {
    keys = [];
    for (var obj in jsonData) {
        if (jsonData.hasOwnProperty(obj)) {
            for (var prop in jsonData[obj]) {
                if (jsonData[obj].hasOwnProperty(prop)) {
                    keys.push(prop);
                }
            }
        }
    }
    newKeys = keys.filter(function(este, i) {
        return keys.indexOf(este) === i;
    });
    return newKeys;
}

function get_values(jsonData) {
    values = [];
    for (var obj in jsonData) {
        if (jsonData.hasOwnProperty(obj)) {
            for (var prop in jsonData[obj]) {
                if (jsonData[obj].hasOwnProperty(prop)) {
                    values.push(jsonData[obj][prop]);
                }
            }
        }
    }
    console.log(values);
    return values;
}

function get_first_letter(word){
    var matches = word.match(/\b(\w)/g);
    var acronym = matches.join('');
    return acronym;
}

function create_table(nome_consulta, id_table, titulo_consulta, categoria) {
    var html = '<div class="col-md-12"><div class="card card-plain"><div class="card-header card-header-primary"><h4 class="card-title">' + titulo_consulta + '</h4><p class="card-category">' + categoria + '</p></div><div class="card-body"> <div class="table-responsive"><table class="table table-hover" id = "' + id_table + '">';
    $.ajax({
        type: "GET",
        url: "../php/consultas.php",
        data: "consulta=" + nome_consulta,
        success: function(response) {
            console.log(response);
            cabecalho = get_keys(response);
            id = 1;
            thead = "<thead class=\"text-primary cabecalho\"><th><b>ID</b> <i class=\"fa fa-fw fa-sort\"></i></th>";
            for (i = 0; i < cabecalho.length; i++) {
                id++;
                thead += "<th><b>" + cabecalho[i] + "</b> <i class=\"fa fa-fw fa-sort\"></i></th>";
            }
            thead += "</thead>";
            tbody = "<tbody>";
            for (i = 0; i < response.length; i++) {
                id = i + 1;
                tbody += "<tr class = \"" + nome_consulta + "_item\"><td>" + id + "</td>";
                for (j = 0; j < Object.keys(response[i]).length; j++) {
                    tbody += "<td>" + response[i][Object.keys(response[i])[j]] + "</td>";
                }
                tbody += "</tr>"
            }
            tbody += "</tbody></table></div></div></div></div>";
            aux = thead + tbody;
            html += aux;

            $("#tabelas").append(html);
            $("#" + id_table).DataTable({
                "bLengthChange": false,
                "scrollX": false,
                "lengthMenu": [
                    [5]
                ],
                "language": {
                    "lengthMenu": "Exibir _MENU_ registros por página",
                    "zeroRecords": "Nenhum registro encontrado",
                    "info": "Página _PAGE_ de _PAGES_",
                    "infoEmpty": "Nenhum registro encontrado",
                    "infoFiltered": "(Filtrado de _MAX_ registros)",
                    "search": "Pesquisar",
                    "paginate": {
                        "previous": "Anterior",
                        "next": "Próximo"
                    }
                }
            });

        },
        error: function(r) {
            alert("Erro ao consultar " + nome_consulta + "\nCod:" + r.status);
        }
    });
}

function log_out(){
    //TODO Matar a sessão
    alert("Usuário deslogado");
    window.location.href = "../pages/Login/";
}

function chart1(){
    var nome_consulta = "consulta_combustivel_mais_vendido";
    $.ajax({
        type: "GET",
        url: "../php/consultas.php",
        data: "consulta=" + nome_consulta,
        success: function(response) {
            labels = [];
            series = [];
            for(i=0;i<response.length;i++){
                labels.push(response[i]["Nome do Combustivel"]);
                series.push(response[i]["Quantidade de Vezes"])
            }
            
            if ($('#dash_consulta_1').length != 0 && $('#dash_consulta_1').length != 0) {
                // ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- //
            
                chart = {
                  labels: labels,
                  series: [
                    series
                  ]
                };
            
                optionsDailySalesChart = {
                  lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                  }),
                  low: 0,
                  high: 20, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                  chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                  },
                }
            
                var dailySalesChart = new Chartist.Line('#dash_consulta_1', chart, optionsDailySalesChart);
            
                var animationHeaderChart = new Chartist.Line('#dash_consulta_1', chart, optionsDailySalesChart);
            
              }
        }
    });
}

function chart2(){
    var nome_consulta = "consulta_posto_mais_vendas";
    $.ajax({
        type: "GET",
        url: "../php/consultas.php",
        data: "consulta=" + nome_consulta,
        success: function(response) {
            labels = [];
            series = [];
            for(i=0;i<response.length;i++){
                labels.push(get_first_letter(response[i]["NomeDoPosto"]));
                series.push(response[i]["Vezes"])
            }
            var dataWebsiteViewsChart = {
                labels: labels,
                series: [
                    series
                ]
            };
            var optionsWebsiteViewsChart = {
                axisX: {
                showGrid: false
                },
                low: 0,
                high: 10,
                chartPadding: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0
                }
            };
            var responsiveOptions = [
                ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function(value) {
                    return value[0];
                    }
                }
                }]
            ];
            var websiteViewsChart = Chartist.Bar('#dash_consulta_2', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);
        
            //start animation for the Emails Subscription Chart
            md.startAnimationForBarChart(websiteViewsChart);
        }
    });
}

function chart3(){
    var nome_consulta = "consulta_qtd_vendas";
    $.ajax({
        type: "GET",
        url: "../php/consultas.php",
        data: "consulta=" + nome_consulta,
        success: function(response) {
                labels = [];
                series = [];
                for(i=0;i<response.length;i++){
                    labels.push(get_first_letter(response[i]["Nome fantasia"]));
                    series.push(response[i]["Quantidade"])
                }
                dataCompletedTasksChart = {
                  labels: labels,
                  series: [
                    series
                  ]
                };
          
                optionsCompletedTasksChart = {
                  lineSmooth: Chartist.Interpolation.cardinal({
                    tension: 0
                  }),
                  low: 0,
                  high: 7, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                  chartPadding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                  }
                }
          
                var completedTasksChart = new Chartist.Line('#dash_consulta_3', dataCompletedTasksChart, optionsCompletedTasksChart);
          
                // start animation for the Completed Tasks Chart - Line Chart
                md.startAnimationForLineChart(completedTasksChart);
        }
    });
}

function media_apuracao(id){
    var nome_consulta = "consulta_media_preco";
    $.ajax({
        type: "GET",
        url: "../php/consultas.php",
        data: "consulta=" + nome_consulta,
        success: function(response){
            value = parseFloat(response[0]["Media"]);
            $("#"+id).text("$"+value.toFixed(2));
        }
    });
}