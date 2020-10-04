"use strict";
document.addEventListener('DOMContentLoaded', init);

function init(){
    let boton = document.querySelector('#boton');
    boton.addEventListener("click", validarcaptcha);
    document.querySelector(".btn_links").addEventListener("click", toggleMenu);
    
    function validarcaptcha() {
        let captcha = "L4G4RT0";
        let inputcaptcha = document.querySelector('#inputUsuario');
        let ingresoUsuario = inputcaptcha.value;
        if (ingresoUsuario === captcha) {
            alert("Codigo generado con exito, comentario enviado");
        }
        else {
            alert("Codigo no valido, intente devuelta por favor");
        }
    }
    
    function toggleMenu() {
        document.querySelector("nav").classList.toggle("show");
    }
}