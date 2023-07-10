
class CovidService {

    _apiBase = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/json/'


    getResource = async (url) => {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Could not getch ${url}, status: ${response.status}`);

        }

        return await response.json();
    }

    getCovidData = async () => {
        const covidData = await this.getResource(`${this._apiBase}`)
        return covidData.records
    }


}

export default CovidService;