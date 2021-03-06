//Tarea para Teria de Mediciones Electricas
//Rafnix Guzman C.I: 19.542.888
//Ver 1.0

$(document).ready(function(){
  	
	//Funcion para procesar los archivos CSV - Lee Linea a Linea
	//Retorna una array.
	function processData(textoCompleto) {
		var texto = textoCompleto.split(/\r\n|\n/);
		var lineas = [];
		$.each(texto, function(index, value) {
			lineas.push(parseFloat(value));
    	});

		return lineas;
	};
	//Funcion para hacer los calculos del valor rms,
	//valor promedio, y valor promedio rectificado.
	function calcular(datos){
		var promedio = 0;
        var promedio_rect = 0;
        var suma_cuadrado = 0;
        
        for (var i = 0 ; i < datos.length ; i++){
        	promedio += parseFloat( datos[i]);
        	promedio_rect += parseFloat(Math.abs(datos[i]));
        	suma_cuadrado += parseFloat(Math.pow(datos[i],2));

        };

        if (promedio < 0.01){
        	promedio=0;
        }

        var valor_promedio = promedio/datos.length;
        var valor_promedio_rect = promedio_rect/datos.length;
        var valor_rms = Math.sqrt(suma_cuadrado/datos.length);
        var vector =[];
        vector[1] = valor_promedio;
        vector[2] = valor_promedio_rect;
        vector[3] = valor_rms;
        return vector;
	};
	//calcula el modul a un array
	function modulo(datos){
		for (var i = 0; i < datos.length; i++) {
			datos[i]= Math.abs( datos[i]);
		};
		return datos;

	};
	
	//Cargando el archivo con el metodo GET
	$.ajax({
        type: "GET",
        url: "./archivos/voltaje.csv",
        dataType: "text",
        success: function(data) {
			var vectorV = [];
            var data_procesadaV = processData(data, false);
            vectorV = calcular(data_procesadaV);
            //Imprimo los datos en el HTML
            $('#promedioV').html("Valor Promedio: " + vectorV[1] + " [V]");
            $('#rmsV').html("Valor RMS: " + vectorV[2] + " [V]");
            $('#promedio_rect_V').html("Valor Promedio Rectificado: " + vectorV[3] + " [V]");
            //Graficando Voltaje
            $('#gVoltaje').highcharts({
		        title: {
		            text: 'Grafica de Voltaje',
		            x: -20 //center
		        },
		        
		        yAxis: {
		            title: {
		                text: 'Voltaje [V]'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            valueSuffix: 'V'
		        },
		        
		        series: [{
		            name: 'Voltaje',
		            data: data_procesadaV
		        }]
		    });
            //Graficando Voltaje Rectificado
            $('#gVoltajeR').highcharts({
		        title: {
		            text: 'Grafica de Voltaje Rectificado',
		            x: -20 //center
		        },
		        
		        yAxis: {
		            title: {
		                text: 'Voltaje [V]'
		            },
		            plotLines: [{
		                value: 0,
		                width: 1,
		                color: '#808080'
		            }]
		        },
		        tooltip: {
		            valueSuffix: 'V'
		        },
		        
		        series: [{
		            name: 'Voltaje',
		            data: modulo(data_procesadaV)
		        }]
		    });
            //Cargando el archivo de corriente con metodo GET
			$.ajax({
		        type: "GET",
		        url: "./archivos/corriente4.csv",
		        dataType: "text",
		        success: function(data) {
					var vectorC = [];
		            var data_procesadaC = processData(data, false);
		            vectorC = calcular(data_procesadaC);
		            //Imprimiendo datos al HTML
		            $('#promedioC').html("Valor Promedio: " + vectorC[1] + " [A]");
		            $('#rmsC').html("Valor RMS: " + vectorC[2] + " [A]");
		            $('#promedio_rect_C').html("Valor Promedio Rectificado: " + vectorC[3] + " [A]");
		           	//Graficando Corriente
		           	$('#gCorriente').highcharts({
				        title: {
				            text: 'Grafica de Corriente',
				            x: -20 //center
				        },
				        
				        yAxis: {
				            title: {
				                text: 'Corriente [A]'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },
				        tooltip: {
				            valueSuffix: 'A'
				        },
				        
				        series: [{
				            name: 'Corriente',
				            data: data_procesadaC
				        }]
				    });
		           	//Graficando Corriente Rectificada
				    $('#gCorrienteR').highcharts({
				        title: {
				            text: 'Grafica de Corriente Rectificada',
				            x: -20 //center
				        },
				        
				        yAxis: {
				            title: {
				                text: 'Corriente [A]'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },
				        tooltip: {
				            valueSuffix: 'A'
				        },
				        
				        series: [{
				            name: 'Corriente',
				            data: modulo(data_procesadaC)
				        }]
				    });
				    //Calculos de potencia
					var potencia_prom = 0;
					var potencia_inst = [];
            		for (var i = 0; i < data_procesadaV.length; i++) {
            			potencia_prom += parseFloat(data_procesadaV[i]*data_procesadaC[i]);
            			potencia_inst[i] = parseFloat(data_procesadaV[i]*data_procesadaC[i]);

            		};
            		potencia_prom= potencia_prom/data_procesadaV.length;
            		var potencia_aparente = vectorC[2]*vectorV[2];
            		//Imprimiendo datos al HTML
            		$('#potenciaProm').html("Potencia Promedio por Ciclo: " + potencia_prom + " [W]");
		            $('#potenciaAparente').html("Potencia Aparente: " + potencia_aparente + " [W]");
		            //Graficando potencia
        			$('#gPotencia').highcharts({
				        title: {
				            text: 'Grafica de Potencia Instantanea',
				            x: -20 //center
				        },
				        
				        yAxis: {
				            title: {
				                text: 'Potencia [W]'
				            },
				            plotLines: [{
				                value: 0,
				                width: 1,
				                color: '#808080'
				            }]
				        },
				        tooltip: {
				            valueSuffix: 'W'
				        },
				        
				        series: [{
				            name: 'Potencia',
				            data: potencia_inst
				        }]
				    });
        		}
			});
            
        }

    });
});