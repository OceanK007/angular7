import { Injectable } from "@angular/core";
import { Http, Response } from '@angular/http';
import { RecipesService } from "../recipes/recipes-services";
import { Recipe } from "../recipes/recipe.model";
import { map } from "rxjs/operators";
import { FirebaseAuthService } from "../auth/firebase.auth.service";

@Injectable()
export class DataStorageService {
    databaseURL = 'https://udemy-angular-database.firebaseio.com/recipe-book.json';
    constructor(private http: Http, private recipesSevice: RecipesService, private firebaseAuthService: FirebaseAuthService) {}

    storeRecipes() {
        let accessToken = this.firebaseAuthService.getToken();
        return this.http.put(this.databaseURL+'?auth='+accessToken, this.recipesSevice.getRecipes());
    }

    getRecipes() {
        let accessToken = this.firebaseAuthService.getToken();

        this.http.get(this.databaseURL+'?auth='+accessToken).pipe(map(
            (response: Response) => {
                // In case the data fetched has a missing property, then we are
                // using .map operator to explicitly add the missing property in .json
                const recipes: Recipe[] = response.json();
                for(let recipe of recipes) {
                    if(!recipe['ingredients']) {
                        //console.log(recipe);
                        recipe['ingredients'] = [];
                    }
                }
                return recipes;
            }
        )).subscribe(
            (recipes: Recipe[]) => {
                this.recipesSevice.setRecipes(recipes);
            }
        );
    }
}