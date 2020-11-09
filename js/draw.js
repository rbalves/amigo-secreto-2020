var participants = [];
var draw = [];
const baseDomain = `https://jsonbox.io`

async function getParticipants(){
    const baseURL = `${baseDomain}/box_d09c8a148abf36cadce7`
    const response = await axios.get(`${baseURL}`)
    participants = response.data
}

async function getDraw(){
	const baseURL = `${baseDomain}/box_fcacb56359f41d4bb91d`
    const response = await axios.get(`${baseURL}`)
    draw = response.data
}

async function avancar() {
	const name = document.getElementById("name").value;
	const user = getParticipantByName(name);
	localStorage.setItem("nameTemp", user.name);

	esconderPrimeirPasso()
	exibirCumprimento(name)

	if(user.password === ''){
		removerFormularioLogin()
		exibirFormularioCadastro()
	} else {
		removerFormularioCadastro()
		exibirFormularioLogin()
	}
}

async function esconderPrimeirPasso() {
	const stepName = document.getElementById('step-nome')
	stepName.remove()
}

async function exibirCumprimento(nome) {
	const h3 = document.getElementById('hello')
	h3.innerHTML = `Olá, ${nome}!`
	h3.style.visibility = 'visible'
}

async function exibirFormularioCadastro() {
	const elemento = document.getElementById('step-cadastro')
	elemento.style.visibility = 'visible'
}

async function removerFormularioCadastro() {
	const elemento = document.getElementById('step-cadastro')
	elemento.remove()
}

async function exibirFormularioLogin() {
	const elemento = document.getElementById('step-login')
	elemento.style.visibility = 'visible'
}

async function removerFormularioLogin() {
	const elemento = document.getElementById('step-login')
	elemento.remove()
}

async function login() {

	const name = localStorage.getItem("nameTemp");
	const passwordForm = document.getElementById("password-login").value;
	const user = getParticipantByName(name);

	if(user.password === passwordForm){
		goToHome(user);
	}else{
		alert('Senha incorreta!')
	}
}

async function cadastrar() {

	const name = localStorage.getItem("nameTemp");
	const passwordForm = document.getElementById("password-cadastro").value;
	const user = getParticipantByName(name);

	user.password = passwordForm;

	exibirLoading()
	await savePassword(user)
	goToHome(user);
}

function exibirLoading() {
	const loading = document.getElementById('loading');
	const h2 = document.createElement('h2')
	h2.innerHTML = 'Aguarde...';
	loading.append(h2)
	
	const h3 = document.getElementById('hello')
	h3.remove()
	const form = document.getElementById('step-cadastro');
	form.remove()
}

function getParticipantByName(name){
	return participants.find(participant => participant.name == name);
}

async function goToHome(user){
	const drawn = await drawFriend(user.id);
	const {name} = getParticipantById(drawn.idDrawn);
	localStorage.setItem("name", user.name);
	localStorage.setItem("drawn", name);
	window.location.href = "home.html";
}

async function savePassword(user){
	await axios.put(`${baseDomain}/box_d09c8a148abf36cadce7/${user._id}`, user);
}

async function isLogged(){
	if(localStorage.getItem("name")){
		const welcome = document.getElementById('welcome');
		welcome.appendChild(document.createTextNode('Bem-vindo(a), ' + localStorage.getItem("name") + '!'));
		const message = document.getElementById('message');
		message.appendChild(document.createTextNode('Seu amigo oculto é: ' + localStorage.getItem("drawn")))
	}else{
		logout();
	}
}

function logout(){
	localStorage.clear();
	window.location.href = "index.html";
}

async function drawFriend(id){
	const drawn = isInDraw(id);
	// if(drawn.idDrawn == ""){
	// 	const candidates =  filterCandidates(id);
	// 	const randomDrawn = randomParticipant(candidates);
	// 	await axios.put(`${baseDomain}/box_fcacb56359f41d4bb91d/${drawn._id}`,
	// 		{
	// 			idParticipant: id,
	// 			idDrawn : randomDrawn.id
	// 		}
	// 	);
	// 	const participant = getParticipantById(randomDrawn.id);
	// 	participant.drawn = true;
	// 	await axios.put(`${baseDomain}/box_d09c8a148abf36cadce7/${participant._id}`, participant)
	// 	draw.forEach(item => {
	// 		if(item.idParticipant == id) item.idDrawn = randomDrawn.id;
	// 	});
	// }
	return drawn;
}

function isInDraw(id){
	return draw.find(item => item.idParticipant == id);
}

function wasDrawn(id){
	return draw.find(item => item.idDrawn == id);
}

function getParticipantById(id){
	return participants.find(participant => participant.id == id);
}

function randomParticipant(candidates) {
    let min = Math.ceil(0);
    let max = Math.floor(candidates.length -1);
    let index = Math.floor(Math.random() * (max - min + 1)) + min;
    return candidates[index];
}

function filterCandidates(id){
	const withOutParticipant = participants.filter(person => person.id != id);
	const theUnaffected = withOutParticipant.filter(person => !person.drawn);
	const presenter = wasDrawn(id);
	if(presenter){
		return theUnaffected.filter(person => person.id != presenter.id);
	}
	return theUnaffected;
}
