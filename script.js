const costoViaje = 6;
const gananciaAuto = 2;
const costoPerdida = 1;
const maxEspera = 12;
const tiempoLlegadaA = 1;
const tiempoLlegadaB = 5;
const cantLlegadaA = 1;
const cantLlegadaB = 3;
var duracionViaje;
const capacidadVagon = 5;

const politicaTitulo = document.getElementById("politica");



var tablaColas = document.getElementById("tablaColas");


function obtenerInputs(){
    var cantEventos = Number(document.getElementById("cantEventos").value);
    var desde = Number(document.getElementById("mostrarDesde").value);
    var hasta = Number(document.getElementById("mostrarHasta").value);
    var politica = document.getElementById("selector").value;
    return [cantEventos, desde, hasta, politica];
}


function generarColasPA(cantEventos, desde, hasta){

    var ubicacionVagon = "A";
    var ubicacionVagonAnterior;
    var autosPerdidosAC = 0;
    var arrayAutosA = [];
    var arrayAutosB = [];
    var tiempoViajeAC = 0;
    var cantAutosFinViaje = 0;
    var gananciaAC = 0;
    var colaA = 0; 
    var colaB = 0;
    var filaTabla = [ new Array(24).fill(0), new Array(24).fill(0)];
    var grillaFinal = []; 
    duracionViaje = 5;
    var proxLlegadaB = 5;
    var finViaje = "-";
    var tiempoProxCalentamiento;
    var rndCalentamiento = Math.random();
    var tiempoReparacion = "-";
    var finReparacion = "-";


    if(rndCalentamiento<0.2){
        temperaturaInestabilidad = 50;
    }
    else{
        if(rndCalentamiento<0.5){
            temperaturaInestabilidad = 70;
        }
        else{
            temperaturaInestabilidad = 100;
        }    
    }

    tiempoProxCalentamiento = Number(rungeKuttaV1(temperaturaInestabilidad).toFixed());
    var proxCalentamiento = tiempoProxCalentamiento;


    for (var i=1; i<=cantEventos ; i++){
  
        var reloj = i;
        var autosPerdidos = 0;
        var proxLlegadaA = reloj + tiempoLlegadaA;
        var gananciaActual = 0;

        if(reloj == proxLlegadaB){
            proxLlegadaB += tiempoLlegadaB;
        }

        var autoA = {
            tiempoEspera: -1
        }
        arrayAutosA.push(autoA);

        for (var k=0; k<arrayAutosA.length; k++){   
            arrayAutosA[k].tiempoEspera++;   
        }

        if (reloj % 5 == 0 ){
            for (var j=0; j<3 ; j++){
                var autoB = {
                    tiempoEspera: -1
                }
                arrayAutosB.push(autoB);
            }
        }       


        if (reloj == finViaje && ubicacionVagon != "R" || reloj == 5){
   
            if(ubicacionVagon=="A"){
                ubicacionVagon = "B";

                if (arrayAutosA.length >= 5){
                    arrayAutosA.splice(0,5);
                    cantAutosFinViaje += 5;
                    gananciaActual+= (capacidadVagon * gananciaAuto) - costoViaje 
                }
            }
            else{
                ubicacionVagon = "A";

                if (arrayAutosB.length >= 5){
                    arrayAutosB.splice(0,5);
                    cantAutosFinViaje += 5;
                    gananciaActual+= (capacidadVagon * gananciaAuto) - costoViaje 
                }
            }

            if (reloj >= 10){
                tiempoViajeAC += 5;

            }
            finViaje = reloj + duracionViaje;
        }
        if(reloj >= proxCalentamiento){
            ubicacionVagonAnterior = ubicacionVagon;
            ubicacionVagon = "R"; // Reparacion
            tiempoReparacion = Number(rungeKuttaReparacionV1(tiempoProxCalentamiento).toFixed());
            finViaje+= tiempoReparacion;
            finReparacion = reloj + tiempoReparacion;
            tiempoProxCalentamiento = "-";
            proxCalentamiento = "-";

        }        

    

        if(reloj >= finReparacion){
            ubicacionVagon = ubicacionVagonAnterior;
            tiempoReparacion = "-";
            finReparacion = "-";
            tiempoProxCalentamiento = Number(rungeKuttaV1(temperaturaInestabilidad).toFixed());
            proxCalentamiento = reloj + tiempoProxCalentamiento;            
        }
        
        for (var k=0; k<arrayAutosB.length; k++){     
            arrayAutosB[k].tiempoEspera++;
        }

        
        if(arrayAutosA[0]?.tiempoEspera >= 12){
            arrayAutosA.splice(0,1);
            autosPerdidos++;
            gananciaActual--;
        }


        for (var k=0; k<arrayAutosB.length; k++){           

            if(arrayAutosB[k].tiempoEspera >= 12){
                arrayAutosB.splice(k,1);
                autosPerdidos++;
                gananciaActual--;
            }
        } 
        
        
        colaA = arrayAutosA.length;
        colaB = arrayAutosB.length;
        gananciaAC+= gananciaActual;
        autosPerdidosAC+= autosPerdidos;
             

    
        filaTabla.splice(0, 1);
        var insertarRegistro = [reloj,proxLlegadaA,proxLlegadaB,finViaje,tiempoProxCalentamiento,proxCalentamiento,tiempoReparacion,finReparacion,ubicacionVagon,colaA,colaB,gananciaAC,tiempoViajeAC,cantAutosFinViaje,autosPerdidosAC];
    
        filaTabla.push(insertarRegistro);
    
        if((i >= desde && i <= hasta) || i == cantEventos) {
            grillaFinal.push(insertarRegistro);
        }
    
        
    }
    
    console.log(grillaFinal);   
    // console.log(arrayAutosA,arrayAutosB);
    return grillaFinal;
}


function rellenarTabla() {

    var cantEventos = obtenerInputs()[0];
    var desde = obtenerInputs()[1];
    var hasta = obtenerInputs()[2];
    var politica = obtenerInputs()[3]; 

    if(politica == "0"){
        politicaTitulo.style.display = "none";
        document.getElementsByClassName("container")[0].style.display = "none"
        return 0;
    }

    if(politica == "PA"){
        politicaTitulo.innerHTML = "<strong> Politica A:</strong> El vagon espera completar los 5 autos para iniciar traslados en máxima capacidad.";
        politicaTitulo.style.display = "block";
        document.getElementsByClassName("container")[0].style.display = "block"
    }
    if(politica == "PB"){
        politicaTitulo.innerHTML = "<strong> Politica B:</strong> Cuando se finaliza un traslado se inicia de inmediato un nuevo traslado hacia la otra orilla aunque no lleve automóviles (va vacío). El tiempo de traslado sin autos (vacío) es de 3 minutos por no haber carga y descarga.";
        politicaTitulo.style.display = "block";
        document.getElementsByClassName("container")[0].style.display = "block"
    }

    
    tablaColas.innerHTML = "<tr><th>Reloj</th><th>Proxima Llegada A</th><th>Proxima Llegada B</th><th>Fin de Viaje Actual</th><th>Tiempo Prox. Calentamiento</th><th>Prox. Calentamiento</th><th>Tiempo Reparacion</th><th>Fin Reparacion</th><th>Direccion vagón</th><th>Cola A</th><th>Cola B</th><th>AC ganancia</th><th>AC tiempos de viaje</th><th>Cantidad de Autos con viaje finalizado</th><th>Cantidad de Autos perdidos</th></tr>";
    var grilla;
    if(politica=="PA"? grilla = generarColasPA(cantEventos,desde,hasta): grilla = generarColasPB(cantEventos,desde,hasta))
    for(var i=0; i<grilla.length; i++) {
        var cadena = '<tr><td>' + grilla[i][0] +'</td>'
        cadena += '<td>' + (grilla[i][1]) + '</td>';
        cadena += '<td>' + (grilla[i][2]) + '</td>';
        cadena += '<td>' + grilla[i][3] + '</td>';
        cadena += '<td>' + grilla[i][4] + '</td>';
        cadena += '<td>' + grilla[i][5] + '</td>';
        cadena += '<td>' + grilla[i][6] + '</td>';
        cadena += '<td>' + grilla[i][7] + '</td>';
        var direccion = grilla[i][8];
        cadena += '<td class="direccionVagon'+direccion+'">' + grilla[i][8] + '</td>';
        cadena += '<td>' + grilla[i][9] + '</td>';
        cadena += '<td>' + grilla[i][10] + '</td>';
        if(i == grilla.length-1) {
            cadena += '<td class="metrica">' + grilla[i][11] + '</td>';
            cadena += '<td class="metrica">' + grilla[i][12] + '</td>';
            cadena += '<td class="metrica">' + grilla[i][13] + '</td>';
            cadena += '<td class="metrica">' + grilla[i][14] + '</td></tr>';
        } else {
            cadena += '<td>' + grilla[i][11] + '</td>';
            cadena += '<td>' + grilla[i][12] + '</td>';
            cadena += '<td>' + grilla[i][13] + '</td>';
            cadena += '<td>' + grilla[i][14] + '</td></tr>';
        }

        tablaColas.innerHTML += cadena;
    }

}


function generarColasPB(cantEventos, desde, hasta){
    var ubicacionVagon = "A";
    var ubicacionVagonAnterior;
    var autosPerdidosAC = 0;
    var arrayAutosA = [];
    var arrayAutosB = [];
    var tiempoViajeAC = 0;
    var cantAutosFinViaje = 0;
    var gananciaAC = 0;
    var colaA = 0; 
    var colaB = 0;
    var filaTabla = [ new Array(24).fill(0), new Array(24).fill(0)];
    var grillaFinal = []; 
    duracionViaje = 5;
    var proxLlegadaB = 5;
    var finViaje = "-";
    var tiempoProxCalentamiento;
    var rndCalentamiento = Math.random();
    var tiempoReparacion = "-";
    var finReparacion = "-";

    
    if(rndCalentamiento<0.2){
        temperaturaInestabilidad = 50;
    }
    else{
        if(rndCalentamiento<0.5){
            temperaturaInestabilidad = 70;
        }
        else{
            temperaturaInestabilidad = 100;
        }    
    }

    tiempoProxCalentamiento = Number(rungeKuttaV1(temperaturaInestabilidad).toFixed());
    var proxCalentamiento = tiempoProxCalentamiento;


    for (var i=1; i<=cantEventos ; i++){

        var reloj = i;
        var autosPerdidos = 0;
        var proxLlegadaA = reloj + tiempoLlegadaA;
        var gananciaActual = 0;

        if(reloj == proxLlegadaB){
            proxLlegadaB += tiempoLlegadaB;
        }
        

        var autoA = {
            tiempoEspera: -1
        }
        arrayAutosA.push(autoA);
    
        for (var k=0; k<arrayAutosA.length; k++){   
            arrayAutosA[k].tiempoEspera++;   
        }

        if (reloj % 5 == 0 ){
            for (var j=0; j<3 ; j++){
                var autoB = {
                    tiempoEspera: -1
                }
                arrayAutosB.push(autoB);
            }
        }

        if (reloj == finViaje && ubicacionVagon != "R" || reloj == 1){

            if(ubicacionVagon=="A"){
                ubicacionVagon = "B";
                var longitud = arrayAutosA.length;

                if (longitud >= 5 ){
                    arrayAutosA.splice(0,5);   
                    cantAutosFinViaje += 5;
                    gananciaActual+= (capacidadVagon * gananciaAuto) - costoViaje;
                    tiempoViajeAC += 5;
                } 
                else{
                    arrayAutosA.splice(0,longitud);
                    cantAutosFinViaje += longitud;
                    gananciaActual+= (longitud * gananciaAuto) - costoViaje;
                    if(longitud == 0){
                        tiempoViajeAC += 3;
                        duracionViaje = 3;
                    }
                    else{
                        tiempoViajeAC += 5;
                    }
                }            
            }

            else{
                ubicacionVagon = "A";
                var longitud = arrayAutosB.length;

                if (longitud >= 5 ){
                    arrayAutosB.splice(0,5);   
                    cantAutosFinViaje += 5;
                    gananciaActual+= (capacidadVagon * gananciaAuto) - costoViaje;
                    tiempoViajeAC += 5;
                } 
                else{
                    arrayAutosB.splice(0,longitud);
                    cantAutosFinViaje += longitud;
                    gananciaActual+= (longitud * gananciaAuto) - costoViaje;
                    if(longitud == 0){
                        tiempoViajeAC += 3;
                        duracionViaje = 3;
                    }
                    else{
                        tiempoViajeAC += 5;
                    }
                }                
            }  
            finViaje = reloj + duracionViaje;
        }        
        if(reloj >= proxCalentamiento){
            ubicacionVagonAnterior = ubicacionVagon;
            ubicacionVagon = "R"; // Reparacion
            tiempoReparacion = Number(rungeKuttaReparacionV1(tiempoProxCalentamiento).toFixed());
            finViaje+= tiempoReparacion;
            finReparacion = reloj + tiempoReparacion;
            tiempoProxCalentamiento = "-";
            proxCalentamiento = "-";

        }   
        
        if(reloj >= finReparacion){
            ubicacionVagon = ubicacionVagonAnterior;
            tiempoReparacion = "-";
            finReparacion = "-";
            tiempoProxCalentamiento = Number(rungeKuttaV1(temperaturaInestabilidad).toFixed());
            proxCalentamiento = reloj + tiempoProxCalentamiento;            
        }


        for (var k=0; k<arrayAutosB.length; k++){     
            arrayAutosB[k].tiempoEspera++;
        }
      
        if(arrayAutosA[0]?.tiempoEspera >= 12){
            arrayAutosA.splice(0,1);
            autosPerdidos++;
            gananciaActual--;
        }

        for (var k=0; k<arrayAutosB.length; k++){           

            if(arrayAutosB[k].tiempoEspera >= 12){
                arrayAutosB.splice(k,1);
                autosPerdidos++;
                gananciaActual--;
            }
        } 

        colaA = arrayAutosA.length;
        colaB = arrayAutosB.length;
        gananciaAC+= gananciaActual;
        autosPerdidosAC+= autosPerdidos;

        filaTabla.splice(0, 1);
        var insertarRegistro = [reloj,proxLlegadaA,proxLlegadaB,finViaje,tiempoProxCalentamiento,proxCalentamiento,tiempoReparacion,finReparacion,ubicacionVagon,colaA,colaB,gananciaAC,tiempoViajeAC,cantAutosFinViaje,autosPerdidosAC];

        filaTabla.push(insertarRegistro);
    
        if((i >= desde && i <= hasta) || i == cantEventos) {
            grillaFinal.push(insertarRegistro);
        }

    
    }


    console.log(grillaFinal);   

    return grillaFinal;

}


function main() {
    rellenarTabla();
    tablaColas.style.display = "block";
}

document.getElementById("btnAceptar").addEventListener('click', () => {
    main();
})

var t;
var A = 0;
var k1;
var k2;
var k3;
var k4;
var ti;
var ai;

var A0Reparacion = 60;


const h = 0.1;
const t0 = 0;
const A0 = 15;
const alfa = 0.031618666;

var temperaturaInestabilidad = 100;

function rungeKuttaV1(temperaturaInestabilidad){

    var filaTabla = [ new Array(8).fill(0), new Array(8).fill(0)];
    var i = 0;

    while( A<=temperaturaInestabilidad ){

        if(i == 0){
            filaTabla.splice(0, 1);
            var insertarRegistro = [0,0,0,0,0,0,t0,A0];
            filaTabla.push(insertarRegistro);
            i++;
        }
        else{
            t = filaTabla[1][6];
            A = filaTabla[1][7];
            k1 = alfa * A ;
            k2 = alfa * (A + (h/2) * k1 ) ;
            k3 = alfa * (A + (h/2) * k2 ) ; 
            k4 = alfa * (A + h * k3 ) ;
            ti = t + h;
            ai = A + (h/6) * (k1 + 2 * k2 + 2 * k3 + k4);

            filaTabla.splice(0, 1);
            var insertarRegistro = [t,A,k1,k2,k3,k4,ti,ai];
            filaTabla.push(insertarRegistro);
        }
        
    }
    
    
    console.log(filaTabla);
    return filaTabla[0][0];
}

// rungeKuttaV1(temperaturaInestabilidad);


function rungeKuttaV2(temperaturaInestabilidad){

    var filaTabla = [ new Array(8).fill(0), new Array(8).fill(0)];
    var i = 0;

    while( A<=temperaturaInestabilidad ){

        if(i == 0){
            filaTabla.splice(0, 1);
            var insertarRegistro = [0,0,0,0,0,0,t0,A0];
            filaTabla.push(insertarRegistro);
            i++;
        }
        else{
            t = filaTabla[1][6];
            A = filaTabla[1][7];
            k1 = h * (alfa * A );
            k2 = h * (alfa * (A + 0.5 * k1));
            k3 = h * (alfa * (A + 0.5 * k2)); 
            k4 = h * (alfa * (A + k3));
            ti = t + h;
            ai = A + (1/6) * (k1 + 2 * k2 + 2 * k3 + k4);

            filaTabla.splice(0, 1);
            var insertarRegistro = [t,A,k1,k2,k3,k4,ti,ai];
            filaTabla.push(insertarRegistro);
        }
        
    }   

    console.log(filaTabla);
    return filaTabla;
}

// rungeKuttaV2(temperaturaInestabilidad);




function rungeKuttaReparacionV1(A0Reparacion){

    var filaTabla = [ new Array(8).fill(0), new Array(8).fill(0)];
    var i = 0;
    var res = 0;

    while( res > 0.02 || res <= 0 ){

        var Aanterior = filaTabla[0][1];
        var Aactual = filaTabla[1][1];
        var res = Aanterior - Aactual;

        if(i == 0){
            filaTabla.splice(0, 1);
            var insertarRegistro = [0,0,0,0,0,0,t0,A0Reparacion];
            filaTabla.push(insertarRegistro);
            i++;
        }
        else{
            t = filaTabla[1][6];
            A = filaTabla[1][7];
            k1 = - alfa * A * 0.5;
            k2 = - alfa * (A + (h/2) * k1 ) ;
            k3 = - alfa * (A + (h/2) * k2 ) ; 
            k4 = - alfa * (A + h * k3 ) ;
            ti = t + h;
            ai = A + (h/6) * (k1 + 2 * k2 + 2 * k3 + k4);

            filaTabla.splice(0, 1);
            var insertarRegistro = [t,A,k1,k2,k3,k4,ti,ai];
            filaTabla.push(insertarRegistro);
        }
    }
    
    
    console.log(filaTabla);
    return filaTabla[0][0];
}

rungeKuttaReparacionV1(A0Reparacion);


function rungeKuttaReparacionV2(A0Reparacion){

    var filaTabla = [ new Array(8).fill(0), new Array(8).fill(0)];
    var i = 0;
    var res = 0;

    while( res > 0.02 || res <= 0 ){

        var Aanterior = filaTabla[0][1];
        var Aactual = filaTabla[1][1];
        var res = Aanterior - Aactual;

        if(i == 0){
            filaTabla.splice(0, 1);
            var insertarRegistro = [0,0,0,0,0,0,t0,A0Reparacion];
            filaTabla.push(insertarRegistro);
            i++;
        }
        else{
            t = filaTabla[1][6];
            A = filaTabla[1][7];
            k1 = h * (-alfa * A * 0.5);
            k2 = h * (-alfa * (A + 0.5 * k1));
            k3 = h * (-alfa * (A + 0.5 * k2)); 
            k4 = h * (-alfa * (A + k3));
            ti = t + h;
            ai = A + (1/6) * (k1 + 2 * k2 + 2 * k3 + k4);

            filaTabla.splice(0, 1);
            var insertarRegistro = [t,A,k1,k2,k3,k4,ti,ai];
            filaTabla.push(insertarRegistro);
        }
        
    }   

    console.log(filaTabla);
    return filaTabla;
}

// rungeKuttaReparacionV2(A0Reparacion);