# Analysis: How infinitefusiondex.com/pokedex Implements Data Loading

## 1. Data Source

- **Pokémon base data**: Usually from public Pokémon datasets (like [PokeAPI](https://pokeapi.co/)), or community-curated JSON files (such as pokedex.json).
- **Fusion data**: Infinite Fusion projects use community-created fusion databases, sourced from official game resources, community contributions, or web scraping.
- **Image resources**: Fusion images are typically created by the community, stored on the server or CDN, with naming conventions like `{leftId}.{rightId}.png`.

## 2. Data Storage

- **Static JSON files**: Most Pokémon sites store base and fusion data as JSON files on the server (e.g., `public/data/pokedex.json`).
- **Image resources**: Images are stored in static folders (e.g., `public/fusions/`) or on external CDNs, loaded dynamically by the frontend.
- **Database (optional)**: If there are user features (comments, favorites), a backend database (MongoDB, PostgreSQL, etc.) may be used, but pure display sites usually only use static files.

## 3. How Data is Loaded into the Webpage

### Frontend Loading Flow

1. **Load data on page initialization**
   - The frontend (React/Next.js/Vue) fetches the static JSON file (e.g., `/data/pokedex.json`) on component mount (useEffect or lifecycle hook).
   - Example:
     ```js
     useEffect(() => {
       fetch('/data/pokedex.json')
         .then(res => res.json())
         .then(setData);
     }, []);
     ```
2. **Render data**
   - The loaded data is stored in component state, and the frontend renders the Pokémon list, details, filters, and search UI.
   - Images are loaded dynamically by constructing URLs like `/fusions/{leftId}.{rightId}.png` or using external links.
3. **Interaction and filtering**
   - Search, filter, and pagination are all implemented in the frontend JS (filtering, sorting, paginating the loaded JSON data).

### SSR/SSG Scenarios (e.g., Next.js)

- With Next.js, you can use `getStaticProps` or `getServerSideProps` to load JSON data at build time or request time, passing it as props to the page component for better SEO and first paint.
- Example:
  ```js
  export async function getStaticProps() {
    const res = await fetch('https://yourdomain.com/data/pokedex.json');
    const pokedex = await res.json();
    return { props: { pokedex } };
  }
  ```

## 4. Summary

- **Data source**: Community-curated JSON data, image resource packs.
- **Data storage**: Static JSON files and images, placed in public/data and public/fusions or on a CDN.
- **Data loading**: Frontend fetches JSON, images are loaded by URL, all interaction is frontend-driven, SSR/SSG can improve experience.

If you want to implement similar functionality, place your pokedex.json in the public directory, load it with fetch on the frontend, and render with React. If you need code samples or templates, just ask! 