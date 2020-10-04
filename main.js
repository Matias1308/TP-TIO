"use strict";
document.addEventListener('DOMContentLoaded', init);

function init() {
    let baseurl = 'https://web-unicen.herokuapp.com/api/groups/324/datosjugadores'
    let form = document.querySelector("#form-datos");
    let tableBody = document.querySelector("#tabla-body");
    let tag = document.querySelector("#tag");
    let horas = document.querySelector("#horas");
    let rango = document.querySelector("#rango");
    let arma = document.querySelector("#arma");
    let agregartres = document.querySelector("#agregar-3");
    //let borrar = document.querySelector("#borrartabla");
    let filtro = document.querySelector("#filtro");
    let filtrar = document.querySelector("#filtrar");
    let restablecer = document.querySelector("#restablecer");
    let filtrado = false;
    let boton = document.querySelector('#boton');

    boton.addEventListener("click", validarcaptcha);
    document.querySelector(".btn_links").addEventListener("click", toggleMenu);

    // estos estan comentados para que no se agreguen al servidor, cada vez que se carga la pagina
    //agregardatos("Maiky", "1200", "AK", "AK-47");
    //agregardatos("Juan", "1800", "Nova 3", "AWP");
    //agregardatos("MyBass", "600", "Plata 4", "P90");
    obtenerTodos();

    //boton para agregar datos de a 1 al servidor
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        agregardatos(tag.value, horas.value, rango.value, arma.value);
    });

    //boton para agregar datos de a 3 al servidor
    agregartres.addEventListener("click", function (event) {
        event.preventDefault();
        agregardatos(tag.value, horas.value, rango.value, arma.value);
        agregardatos(tag.value, horas.value, rango.value, arma.value);
        agregardatos(tag.value, horas.value, rango.value, arma.value);
    });

    //boton para borrar por completo la tabla, sin borrar los datos del servidor
    /*borrar.addEventListener("click", function (event) {
        event.preventDefault();
        tableBody.innerHTML = '';
        datosjugadores = [];
    });*/
    //boton que activa el filtro
    filtrar.addEventListener("click", function (event) {
        event.preventDefault();
        filtrado = true;
        obtenerTodos();
    });

    //boton para restablecer la tabla sin el filtro
    restablecer.addEventListener("click", function (event) {
        event.preventDefault();
        filtrado = false;
        obtenerTodos();
        filtro.value = '';
    })

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

    //funcion que agrega datos al servidor y llama a otra para leerlos y cargar la tabla con los datos que recibe del servidor
    function agregardatos(tag, horas, rango, arma) {
        let data = {
            "thing": {
                "tag": tag,
                "horas": horas,
                "rango": rango,
                "arma": arma,
            }
        };
        fetch(baseurl, {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(data)
        }).then(function (r) {
            obtenerTodos()
        })
            .catch(function (e) {
                console.log(e)
            })
    }

    //funcion que carga los datos recibidos del servidor a la tabla
    function Actualizartabla(tag, horas, rango, arma, id) {
        tableBody.innerHTML += `
            <tr>
                <td>${tag}</td>
                <td>${horas}</td>
                <td>${rango}</td>
                <td>${arma}</td>
                <td> <button dataid=${id} class="botonborrar"> Borrar </button> <button dataid=${id} class="botoneditar"> Editar </button></td>
            </tr>
        `;
    }

    //funcion para leer los datos que hay en el servidor y llama a una funcion para cargar la tabla con esos datos
    function obtenerTodos() {
        fetch(baseurl, {
            "method": "GET",
        }).then(function (r) {
            return r.json()
        })
            .then(function (json) {
                tableBody.innerHTML = "";
                //si se pone un filtro, carga la tabla con los objetos que cumplan el filtro
                if (filtrado) {
                    json.datosjugadores.forEach(jugador => {
                        if (filtro.value == jugador.thing.rango) {
                            Actualizartabla(jugador.thing.tag, jugador.thing.horas, jugador.thing.rango, jugador.thing.arma, jugador._id);
                        }
                    })
                }
                else {
                    //si no hay un filtro activo, carga la tabla con todos los datos del servidor
                    json.datosjugadores.forEach(jugador => {
                        Actualizartabla(jugador.thing.tag, jugador.thing.horas, jugador.thing.rango, jugador.thing.arma, jugador._id);
                    });
                }
                //boton para borrar un elemento del servidor y por tanto de la tabla
                let borrarfila = document.querySelectorAll(".botonborrar");
                borrarfila.forEach(b => b.addEventListener("click", function (event) {
                    let iditem = b.getAttribute('dataid');
                    borraruno(iditem);
                }));
                //boton para editar un elemento del servidor y por tanto de la tabla (!!)
                let editarfila = document.querySelectorAll(".botoneditar");
                editarfila.forEach(b => b.addEventListener("click", function (event) {
                    let iditem = b.getAttribute('dataid');
                    editardatos(tag.value, horas.value, rango.value, arma.value, iditem);
                }))


                let borrarTodosElementos = document.querySelector("#BorrarElemTodos");
                borrarTodosElementos.addEventListener("click", function (event){
                   json.datosjugadores.forEach(jugador =>{
                    borraruno(jugador._id); 
                }); 
                })

            })
            .catch(function (e) {
                console.log(e)
            })
    }

    //funcion para borrar un elemento del servidor y despues actualizar la tabla sin ese elemento
    function borraruno(id) {
        fetch(`${baseurl}/${id}`, {
            "method": "DELETE",
        })
            .then(function (r) {
                obtenerTodos();
            })
            .catch(function (e) {
                console.log(e)
            })
    }

    //funcion para editar los datos del servidor y cargar la tabla con los datos actualizados
    function editardatos(tag, horas, rango, arma, id) {
        let data = {
            "thing": {
                "tag": tag,
                "horas": horas,
                "rango": rango,
                "arma": arma,
            }
        };
        fetch(`${baseurl}/${id}`, {
            "method": "PUT",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(data)
        }).then(function (r) {
            obtenerTodos()
        })
            .catch(function (e) {
                console.log(e)
            })
    }
}