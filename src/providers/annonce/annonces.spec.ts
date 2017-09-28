
import { TestBed, inject } from '@angular/core/testing';
import { Annonce } from '../../model/annonce';
import { annonces } from '../../model/Annonces';
import { AnnonceProvider } from './annonce';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProfileProvider } from '../profile/profile';
import { firebaseConfig } from "../../environments/firebase.config";
import { AngularFireModule } from 'angularfire2';
import firebase from 'firebase'
/*

let annonce = null;
let an: Annonce= {

  titre : 'telephone iphone',
  description : 'telephone iphone trés bonne état',
  categorie: {nom:'téléphonie'},
  imageURL: '"http://placehold.it/100x60?text=F3"'

}

let an1: Annonce= {

  titre : '',
  description : '',
  categorie: {nom:''},
  imageURL: ''
}
describe('annonces Service', () => {

  beforeEach(() => {
      annonce = new AnnonceProvider();
    });

     it('should return a non empty array', () => {

            let result = annonce.List_des_annonces();

            expect(Array.isArray(result)).toBeTruthy;
            expect(result.length).toBeGreaterThan(0);
        }
    );

    it('should do nothing', () => {

        expect(true).toBeTruthy();

    });

 it('should add an annonce to the list  nothing', () => {
 let result = annonce.Ajouter_annonce(an);
        expect(result).toBeTruthy();

    });

     it('should remove an annonce from  the list', () => {
    let result = annonce.removeAnnonce(an1);
        expect(result).toBeFalsy();

    });


});*/
describe("The Annonce Data Service", () => {

  let AnnonceData: AnnonceProvider;

  let objectSpy = jasmine.createSpy("object").and.callFake((path: string) => {
    if (path.includes("512")) {
      return Observable.of({
        title: "Example Ajout d'annonce",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla commodo dui quis.",
      });
    } else {
      return Observable.throw("Invalid path!");
    }
  });

  let afStub: any = {
    database: {
      object: objectSpy,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(firebaseConfig),

      ],
      providers: [
        { provide: AngularFireDatabase, useValue: afStub },
        ProfileProvider,
        AnnonceProvider,
        firebase,

      ],
    });
  });

  beforeEach(inject([AnnonceProvider], (AnnoncDataInjected: AnnonceProvider) => {
    AnnonceData = AnnoncDataInjected;
  })
  );

  it("should return all data from an annonce when the specified ID  exists", () => {
    AnnonceData.getAnnonce('512').subscribe((annonce: Annonce) => {
      expect(objectSpy).toHaveBeenCalled();
      expect(annonce.titre).toBe("Example Annonce");
      expect(annonce.description).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla commodo dui quis.");
    });
  });

  it("should throw an error when the specified post ID does not exist", () => {
    let value: Observable<Annonce> = AnnonceData.getAnnonce("456");
    value.subscribe((Annonce: any) => {
      fail("This should never be reached");
    }, (error: any) => {
      expect(error).toBe("Invalid path!");
    });
  });

})
