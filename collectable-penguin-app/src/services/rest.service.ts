import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RestService {

  constructor(private httpClient: HttpClient) {
  }

  setupDemo() {
    return this.httpClient.post('http://localhost:3000/api/org.collectable.penguin._demoSetup', null, { withCredentials: true }).toPromise();
  }

  checkWallet() {
    return this.httpClient.get('http://localhost:3000/api/wallet', { withCredentials: true }).toPromise();
  }

  signin(id) {

    // const identity = {
    //   participant: 'org.collectable.penguin.Collector#' + data.id,
    //   userID: data.id,
    //   options: {}
    // };

    const identity = {
      participant: 'org.collectable.penguin.Collector#' + id,
      userID: id,
      options: {}
    };
    return this.httpClient.get('http://localhost:3001/api/org.collectable.penguin.Collector/' + id).toPromise()
      .then((result: any) => {
        console.log(result[0]);
        return this.httpClient.post('http://localhost:3001/api/system/identities/issue', identity, { responseType: 'blob' }).toPromise();
      })
      .then((cardData) => {
        console.log('CARD-DATA', cardData);
        const file = new File([cardData], 'myCard.card', { type: 'application/octet-stream', lastModified: Date.now() });

        const formData = new FormData();
        formData.append('card', file);
        console.log("TEEEEEEEST3")
        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        return this.httpClient.post('http://localhost:3000/api/wallet/import', formData, {
          withCredentials: true,
          headers
        }).toPromise();
      })
      .then((res) => {
        const formData = new FormData();
        console.log("TEEEEEEEST")
        return this.httpClient.post('http://localhost:3000/api/wallet/'+id+'%40bc091120181139/setDefault?access_token=eili0FfVdvzpLwnwXOdS858tHLlwx2hV0MfDb9aUnhnBN7YFDF0y10tm3wdlEXoH', {}).toPromise();
        // return this.httpClient.post('http://localhost:3000/api/wallet/'+id+'@bc091120181139/setDefault',{}).toPromise()
      });
  }
  signUp(data) {
    const collector = {
      $class: 'org.collectable.penguin.Collector',
      collectorId: data.id,
      firstName: data.firstName,
      lastName: data.surname
    };

    return this.httpClient.post('http://localhost:3001/api/org.collectable.penguin.Collector', collector).toPromise();
  }


  getCurrentUser() {
    return this.httpClient.get('http://localhost:3000/api/system/ping', { withCredentials: true }).toPromise()
      .then((data) => {
        return data['participant'];
      });
  }

  getAllPenguins() {
    return this.httpClient.get('http://localhost:3000/api/org.collectable.penguin.Penguin', { withCredentials: true }).toPromise();
  }

  getAvailablePenguins() {
    return this.httpClient.get('http://localhost:3000/api/queries/availablePenguins', { withCredentials: true }).toPromise();
  }

  getMyPenguins() {
    return this.httpClient.get('http://localhost:3000/api/queries/myPenguins', { withCredentials: true }).toPromise();
  }

  buyPenguin(penguinId, currentUser) {
    const transactionDetails = {
      $class: 'org.collectable.penguin.Trade',
      penguin: 'resource:org.collectable.penguin.Penguin#' + penguinId,
      newOwner: currentUser
    };

    return this.httpClient.post('http://localhost:3000/api/org.collectable.penguin.Trade', transactionDetails, { withCredentials: true }).toPromise();
  }
}
