const API_URL = "http://localhost:5678/api";

export async function getData(endpoint) {
	try {
		const response = await fetch(`${API_URL}/${endpoint}`);
		if (!response.ok) {
			return new Error(`Erreur: ${response.status} ${response.statusText}`);
		}
		return response.json();
	} catch (error) {
		return null;
	}
}

export async function sendRequest(endpoint, request) {
	try {
		const response = await fetch(`${API_URL}/${endpoint}`, request);

		if (!response.ok) {
			return new Error('Erreur de connexion');
		}
		let data;
		if (request.headers['Content-Type'] === "application/json") {
			data = await response.json();
		}
		else {
			data = await response;
		}
		return data;

	} catch (error) {
		return error;
	}
}
