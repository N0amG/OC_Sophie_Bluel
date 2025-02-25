const API_URL = "http://localhost:5678/api";

export async function getData(endpoint) {
	try {
		//console.log("Requete envoyé vers :", `${API_URL}/${endpoint}`);
		const response = await fetch(`${API_URL}/${endpoint}`);
		if (!response.ok) {
			throw new Error(`Erreur: ${response.status} ${response.statusText}`);
		}
		return response.json();
	} catch (error) {
		console.error("Erreur lors de la récupération des données :", error);
		return null;
	}
}

export async function sendRequest(endpoint, request) {
	try {
		const response = await fetch(`${API_URL}/${endpoint}`, request);

		if (!response.ok) {
			throw new Error('Erreur de connexion');
		}
		let data;
		if (request.headers['Content-Type'] === "application/json")
			data = await response.json();
		 else 
			data = await response;
		return data;

	} catch (error) {
		console.log(error);
		return error;
	}

}
