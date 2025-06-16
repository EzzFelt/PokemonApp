import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../types/PokemonType';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  standalone: true
})

export class PokemonDetailPage implements OnInit {
  pokemon: Pokemon | null = null;
  loading = false;
  error: string | null = null;
  favorites: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id'); 
    if (id) {
      this.fetchPokemon(id);
    } else {
      this.error = 'No Pokémon specified.';
    }
  });
}

  toggleFavorite(pokemon: Pokemon){
    const index = this.favorites.findIndex(fav => fav.id === pokemon.id);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(pokemon);
    }
  }

  isFavorite(pokemon: Pokemon): boolean {
    return this.favorites.some(fav => fav.id === pokemon.id);
  }

  fetchPokemon(name: string): void {
    this.loading = true;
    this.error = null;
    this.pokemonService.getPokemonByName(name).subscribe({
      next: (data) => {
        this.pokemon = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load Pokémon details.';
        this.loading = false;
      }
    });
  }
}