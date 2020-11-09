var sorteio = [];
var sorteados = [];
var participantes = [1,2,3,4,5,6,7,8,9,10];

function sortear(){
	for (const participante of participantes) {
        const candidatos =  filtrarCandidatos(participante);
        const sorteado = buscarSorteado(candidatos);
        sorteados.push(sorteado)
        sorteio.push(
            {
				idParticipant: participante,
				idDrawn : sorteado
			}
        )
    }
    console.log(sorteio)
}

sortear()

function buscarSorteado(candidates) {
    let min = Math.ceil(0);
    let max = Math.floor(candidates.length -1);
    let index = Math.floor(Math.random() * (max - min + 1)) + min;
    return candidates[index];
}

function filtrarCandidatos(id){
    const removerParticipante = participantes.filter(item => item != id);
    const removerSorteados = removerParticipante.filter(x => !sorteados.includes(x));
    return removerSorteados;
}
