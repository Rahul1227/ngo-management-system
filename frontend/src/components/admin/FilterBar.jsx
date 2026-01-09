import { useState } from 'react';
import Button from '../common/Button';

const FilterBar = ({ filters, onFilterChange, onExport, exportLoading }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (name, value) => {
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const reset = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setLocalFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        {/* Filters */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(localFilters).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="input"
                placeholder={`Filter by ${key}...`}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          {onExport && (
            <Button
              variant="secondary"
              onClick={onExport}
              loading={exportLoading}
            >
              📥 Export
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;