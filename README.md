# Cloned Pokédex

Welcome to the **Cloned Pokédex** project! This simple web-based application allows users to explore and search for Pokémon using the [PokéAPI](https://pokeapi.co/). Users can browse the Pokédex, search for specific Pokémon, filter them by type, and explore their abilities, types, and sprites.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Browse Pokémon**: View a paginated list of Pokémon, including their names, types, abilities, and sprites.
- **Search Functionality**: Search by name, ID, type, or range of IDs (e.g., `range:[1-10]`).
- **Interactive Cards**: Each Pokémon card dynamically displays details such as types and abilities.
- **Load More Button**: Load more Pokémon incrementally.
- **Responsive Design**: Optimized for various screen sizes.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cloned-pokedex.git
   ```

2. Navigate to the project directory:
   ```bash
   cd cloned-pokedex
   ```

3. Open `index.html` in your preferred browser:
   ```
   open index.html
   ```

---

## Usage

1. Open the application in your browser.
2. Use the navigation bar to explore sections.
3. Use the search bar to look for Pokémon by name, ID, type, or a range of IDs.
   - Example searches:
     - `type:fire`
     - `range:[1-50]`
     - `pikachu`
     - `25`
4. Click "Load More Pokémon" to load additional entries.
5. Return to the full Pokédex using the "Return to Pokédex" button.

---

## File Structure

```
cloned-pokedex/
├── index.html          # Main HTML file
├── main.js             # JavaScript file for functionality
├── style.css           # CSS for styling
└── README.md           # Project documentation (this file)
```

---

## Roadmap

### Features to Add:
- Improve search suggestions with autocomplete.
- Add filtering for multiple types (e.g., `type:fire&type:water`).
- Include Pokémon stats and evolutions.
- Add a "Favorites" feature for users to save their favorite Pokémon.

### Known Issues:
- Large queries may cause delays or failures due to API limitations.
- Styling inconsistencies on smaller screens.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request on GitHub.

---

## License

This project is licensed under the [MIT License](LICENSE).