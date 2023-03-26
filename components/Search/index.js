import { useSearchContext } from "../context/search";

const Search = () => {
  const [search, setSearch] = useSearchContext();
  return (
    <input
      type="text"
      placeholder="Search 0x..."
      className="input w-full max-w-xs"
      onChange={(e) => {
        setSearch(e.target.value);
      }}
    />
  );
};

export default Search;
