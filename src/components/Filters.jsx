// The filters shown above the gallery: Era, Origin, Collaboration and Sort

import Tag from "@/src/components/Tag.jsx";
import { ERAS, ORIGINS, COLLAB_LEVELS } from "@/src/lib/artworksData.js";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            <p>The collection</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Era"
            options={["", ...ERAS]}
            value={filters.era}
            onChange={(event) => handleSelectionChange(event, "era")}
            name="era"
            icon="/era.svg"
          />

          <FilterSelect
            label="Origin"
            options={["", ...ORIGINS]}
            value={filters.origin}
            onChange={(event) => handleSelectionChange(event, "origin")}
            name="origin"
            icon="/origin.svg"
          />

          <FilterSelect
            label="Collaboration"
            options={["", ...COLLAB_LEVELS.map((level) => level.label)]}
            value={filters.collab}
            onChange={(event) => handleSelectionChange(event, "collab")}
            name="collab"
            icon="/collab.svg"
          />

          <FilterSelect
            label="Sort"
            options={["Rating", "Critiques"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  setFilters({
                    origin: "",
                    era: "",
                    collab: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Apply
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          // The filter bar already says how the gallery is sorted, so skip the sort tag
          if (type == "sort" || value == "") {
            return null;
          }
          return (
            <Tag key={value} type={type} value={value} updateField={updateField} />
          );
        })}
      </div>
    </section>
  );
}
