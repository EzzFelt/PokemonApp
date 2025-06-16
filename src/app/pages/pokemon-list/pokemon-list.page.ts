import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListResponse } from '../../types/PokemonType';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  standalone: true
})
export class PokemonListPage implements OnInit {
  pokemonList: PokemonListResponse | null = null;
  loading = false;
  error: string | null = null;
  limit = 20;
  offset = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.fetchPokemonList();
  }

  pokemonDetails: any[] = [];

  fetchPokemonList(): void {
  this.loading = true;
  this.error = null;
  this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
    next: (data) => {
      this.pokemonList = data;
      const detailRequests = data.results.map((p) =>
        this.pokemonService.getPokemonByName(p.name)
      );
      forkJoin(detailRequests).subscribe({
        next: (details) => {
          this.pokemonDetails = details;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load Pokémon details.';
          this.loading = false;
        }
      });
    },
    error: () => {
      this.error = 'Failed to load Pokémon list.';
      this.loading = false;
    }
  });
}
  nextPage(): void {
    if (this.pokemonList?.next) {
      this.offset += this.limit;
      this.fetchPokemonList();
    }
  }

  prevPage(): void {
    if (this.pokemonList?.previous && this.offset >= this.limit) {
      this.offset -= this.limit;
      this.fetchPokemonList();
    }
  }

  trackByName(index: number, item: { name: string; url: string }) {
  return item.name;
  }
  
typeColor(type: string): string {
    const colors: { [key: string]: string } = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      bug: '#A8B820',
      normal: '#A8A878',
      poison: '#A040A0',
      ground: '#E0C068',
      fairy: '#EE99AC',
      fighting: '#C03028',
      psychic: '#F85888',
      rock: '#B8A038',
      ghost: '#705898',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      flying: '#A890F0'
    };
    return colors[type] || '#68A090';
  }

  favoriteNames: Set<string> = new Set();

toggleFavorite(pokemon: any) {
  if (this.favoriteNames.has(pokemon.name)) {
    this.favoriteNames.delete(pokemon.name);
  } else {
    this.favoriteNames.add(pokemon.name);
  }
  localStorage.setItem('favoriteNames', JSON.stringify(Array.from(this.favoriteNames)));
}

isFavorite(pokemon: any): boolean {
  return this.favoriteNames.has(pokemon.name);
}

get favorites(): any[] {
  return this.pokemonDetails.filter(p => this.isFavorite(p));
}
  
}