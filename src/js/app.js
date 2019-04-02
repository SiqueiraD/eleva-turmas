// App
const app = angular.module('app', []);

// Service to fetch some data..
app.factory('dataServ', ['$http', ($http) => {
	return {
		get: (url) => $http.get('/' + url),
		post: (url, data) => $http.post('/' + url, data, { data: data }),
		delete: (url, data) => $http.delete('/' + url, data, { data: data }),
	}
}]);



// App controller
app.controller('appController', ['$scope', 'dataServ', ($scope, Data) => {

	function getDatas() {
		Data.get('turmas').success(resp => {
			$scope.turmas = resp;
		});
		Data.get('escolas').success(resp => {
			$scope.escolas = resp;
		});
	}
	getDatas();

	function configuraMenu() {
		var items = document.getElementsByClassName('nmenu-s');
		var tabsPanes = document.getElementsByClassName('tab-pane');
		for (var i = 1; i < tabsPanes.length; i++) {
			tabsPanes[i].hidden = true;
		}
		for (var i = 0; i < items.length; i++) {
			items[i].onclick = (evt) => {
				for (var i = 0; i < tabsPanes.length; i++) {
					tabsPanes[i].hidden = true;
				}
				document.getElementById(evt.target.attributes.href.textContent.replace('#', '')).hidden = false;
				var tabActived = evt.target.parentElement.getElementsByClassName('active')[0];
				tabActived.className = tabActived.className.replace('active', '');
				console.log(evt);
			};
		}
	}
	$scope.configuraMenu = configuraMenu();

	$scope.addEscola = function() {
		var nomeEscola = (inputNomeEscola || document.getElementById('inputNomeEscola')).value;
		var localidadeEscola = (inputLocalidadeEscola || document.getElementById('inputLocalidadeEscola')).value;
		var jsonEscola = new Object();
		jsonEscola.nome = nomeEscola;
		jsonEscola.localidade = localidadeEscola;
		console.log(jsonEscola);
		Data.post('escolas', jsonEscola).success(resp => {
			(inputLocalidadeEscola || document.getElementById('inputLocalidadeEscola')).value = "";
			(inputNomeEscola || document.getElementById('inputNomeEscola')).value = "";
			$scope.escolas = resp;
		})
	}
	$scope.removeEscola = function(item) {
		Data.delete('escolas/' + item._id, item).success(resp => {
			$scope.escolas = resp;
			getDatas();
		})
	}


	$scope.addTurma = function() {
		var escolaId = (inputEscolaId || document.getElementById('inputEscolaId')).value;
		var turmaNome = (inputTurmaNome || document.getElementById('inputTurmaNome')).value;
		var jsonTurma = new Object();
		jsonTurma.escola = new Object();
		jsonTurma.escola.escola_id = escolaId;
		jsonTurma.escola.nome = $scope.escolas.filter(x => x._id == escolaId)[0].nome;
		jsonTurma.nome = turmaNome;
		console.log(jsonTurma);
		Data.post('turmas', jsonTurma).success(resp => {
			(inputEscolaId || document.getElementById('inputEscolaId')).value = "";
			(inputTurmaNome || document.getElementById('inputTurmaNome')).value = "";
			$scope.turmas = resp;
		})
	}
	$scope.removeTurma = function(item) {
		Data.delete('turmas/' + item._id, item).success(resp => {
			$scope.turmas = resp;
		})
	}


}]);
