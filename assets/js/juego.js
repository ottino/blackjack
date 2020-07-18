

// Encampsulado del codigo con patro modulo

// Como exportar parte de mi modulo

const miModulo = (()=> {

    'use strict'

    let deck         = [];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];

    let puntosJugadores = [];        
    
    // Referencias del HTML (DOM)
    const btnNuevo  = document.querySelector('#btnNuevo'),
          btnPedir  = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener');
    
    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');
    
          
    // Inicializar juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        
        deck = crearDeck();

        puntosJugadores = []; // Lo inicio en cada juego
        for( let i = 0 ; i < numJugadores ; i++) puntosJugadores.push(0);

        // Los puntos HTML los inicializo a 0 para todos los jugadores
        puntosHTML.forEach( elem => elem.innerText = 0 );

        // Borro las cartas
        divCartasJugadores.forEach( elem => elem.innerHTML = 0 );

        // Habilito los botones de pedir carta y detener
        btnPedir.disabled = false;
        btnDetener.disabled = false;

    };    
    
    // funcion para crear una baraja
    const crearDeck = () => {
    
        deck = [];

        for(let i = 2; i <= 10; i++ ) {
            for( let tipo of tipos) {
                deck.push( i + tipo );            
            }
        }
    
        for( let tipo of tipos ) {
            for( let especial of especiales ) {
                deck.push( especial + tipo )
            }
        }
    
        return _.shuffle( deck );
    
    }; 
    
    // funcion para pedir una carta
    const pedirCarta = () => {
    
        if ( deck.length === 0 ) {
            throw 'No hay cartas en la baraja';
        }
        
        return deck.pop();
    
    };
    

    // Turno: 0 = 1er jugador y el ultimo sera la computadora
    const acumularPuntos = ( carta , turno ) => {

        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta( carta );
        puntosHTML[turno].innerText = puntosJugadores[turno];            
        return puntosJugadores[turno];
    };

    const crearCarta = ( carta , turno ) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${ carta }.png`; // src
        imgCarta.classList = 'carta'; // css
        divCartasJugadores[turno].append( imgCarta );

    }

    const determinarGanador = () => {

        // desestructuración de arreglos
        const [ puntosMinimos , puntosComputadora ] = puntosJugadores;
        // Espero 10milisegundos a que cargue las cartes y 
        // luego muestro los resultados
        setTimeout( () => {
    
            if (puntosComputadora === puntosJugadores[0])
                alert('No gano nadie!!');
            else if (puntosMinimos > 21)
                alert('Computadora gana!!');
            else if (puntosComputadora > 21)
                alert('Jugador gana');
            else alert('Computadora gana!!');
    
        }, 30);

    };
    // turno de la computadora
    // puntosMinimos son los puntos del jugador
    const turnoComputadora = ( puntosMinimos ) => {
    
        let puntosComputadora = 0;

        do {
            const carta = pedirCarta() ;
    
            puntosComputadora = acumularPuntos( carta , puntosJugadores.length - 1);
            crearCarta( carta , puntosJugadores.length - 1);
    
        } while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21 ) );
    
        determinarGanador();
    
    };
    
    // funcion para saber el valor de una carta
    const valorCarta = ( carta ) => {
    
        const valor = carta.substring(0,carta.length - 1); // omitir la ultima letra

        return ( isNaN( valor ) && valor === 'A' ) ? 11 :
               ( isNaN( valor ) && valor !=  'A' ) ? 10 :
               valor * 1;
        
    };
    
    
    // Eventos
    
    // Escucho Click
    btnPedir.addEventListener('click', () => {
    
        const carta = pedirCarta() ;
        const puntosJugador = acumularPuntos( carta , 0 );

        crearCarta( carta , 0 );
    
        if( puntosJugador > 21 ) {
            console.warn('Perdiste papi!!');
            alert('Perdiste!!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
    
            turnoComputadora( puntosJugador );
    
        } else if ( puntosJugador === 21) {
            console.log('21, Excelente!!!');
            btnPedir.disabled = true;        
            btnDetener.disabled = true;
    
            turnoComputadora( puntosJugador );
        }
    
    });
    
    btnDetener.addEventListener('click' , () =>{
    
        btnPedir.disabled = true;  
        btnDetener.disabled = true;
    
        // en la pos 0 ya se que arroja el jugador 1
        turnoComputadora( puntosJugadores[0] );
    
    });
    
    btnNuevo.addEventListener('click', () => {
    
        inicializarJuego();

    });

    // se retorna unicamente la referencia a la funcion que queremos
    // exportar lde modulo. se puede hacer con un alias que es "nuevoJuego"
    return {

        nuevoJuego : inicializarJuego

    }

})();



