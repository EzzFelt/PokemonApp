import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Pokemon, PokemonListResponse, PokemonType } from '../types/PokemonType';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(limit = 20, offset = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`)
      .pipe(
        catchError(() => throwError(() => new Error('Failed to fetch Pokémon list')))
      );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${name}`)
      .pipe(
        catchError(() => throwError(() => new Error('Failed to fetch Pokémon')))
      );
  }

  getPokemonTypeByName(typeName: string): Observable<PokemonType> {
    return this.http.get<PokemonType>(`${this.apiUrl}/type/${typeName}`)
      .pipe(
        catchError(() => throwError(() => new Error('Failed to fetch Pokémon type')))
      );
  }

}