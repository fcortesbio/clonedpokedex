# Clonned Pokédex

A simple web-based Pokédex that allows users to browse and search for Pokémon using the [PokéAPI](https://pokeapi.co/). This project is built with HTML, CSS, and JavaScript.

## Features

- **Browse Pokémon**: Load and display Pokémon in a grid format with details like name, ID, sprite, type, and abilities.
- **Load More Pokémon**: Load additional Pokémon in batches.
- **Search and Filter**: Search for Pokémon by name, ID, type, or range.
- **Responsive Design**: The Pokédex is designed to work on both desktop and mobile devices.

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari).
- Basic knowledge of HTML, CSS, and JavaScript.

### Install

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fcortesbio/clonnedpokedex.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd clonnedpokedex
   ```

3. **Open the project**:
   - Open the `index.html` file in your web browser.

Alternatively, you can simply download the project files and open `index.html` in your browser.

## Usage

### Browsing Pokémon

- When the page loads, the initial set of Pokémon will be displayed.
- Click the **"Load More Pokémon"** button to load additional Pokémon.

### Searching Pokémon

- Use the search bar to find Pokémon by:
  - **Name**: Enter the name of the Pokémon (e.g., `pikachu`).
  - **ID**: Enter the Pokémon's ID (e.g., `25`).
  - **Type**: Use the `type:` prefix to filter by type (e.g., `type:fire`).
  - **Range**: Use the `range:` prefix to filter by a range of IDs (e.g., `range:[1-10]`).
  - **Combination**: Combine multiple search terms using `&` (e.g., `type:fire&range:[1-10]`).

- Press **Enter** or click the **Search** button to execute the search.

### Returning to the Pokédex

- After performing a search, click the **"Return to Pokédex"** button to go back to browsing all Pokémon.

## Code Structure

- **HTML**: The structure of the Pokédex is defined in `index.html`.
- **CSS**: Styling is handled in `styles.css`.
- **JavaScript**: The logic for fetching and displaying Pokémon data is in `script.js`.

### Key Functions

- **`fetchPokemon(url)`**: Fetches data for a specific Pokémon from the PokéAPI.
- **`fetchPokemonData(limit, offset)`**: Fetches a list of Pokémon with a specified limit and offset.
- **`fetchPokemonByType(type)`**: Fetches all Pokémon of a specific type.
- **`displayPokemon(pokemon)`**: Displays a Pokémon card with details.
- **`processSearchInput(query)`**: Handles search queries and filters Pokémon accordingly.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Submit a pull request.

## License

This is just a learning project, and is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing the Pokémon data.
- [Pokémon DB](https://pokemondb.net/) for ability links.

## Contact

If you have any questions or feedback, feel free to reach out:

- **Fabian Cortes**: [fcortesbio@gmail.com](mailto:fcortesbio@gmail.com)
- **GitHub**: [fcortesbio](https://github.com/fcortesbio)
