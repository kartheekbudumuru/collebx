import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { domains, difficultyLevels } from '@/data/mockData';

interface ProjectFilterProps {
  search: string;
  setSearch: (value: string) => void;
  selectedDomain: string | null;
  setSelectedDomain: (value: string | null) => void;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (value: string | null) => void;
}

export function ProjectFilter({
  search,
  setSearch,
  selectedDomain,
  setSelectedDomain,
  selectedDifficulty,
  setSelectedDifficulty,
}: ProjectFilterProps) {
  const hasFilters = search || selectedDomain || selectedDifficulty;

  return (
    <div className="glass-card rounded-2xl p-4 mb-6">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Domain:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(selectedDomain === domain.id ? null : domain.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDomain === domain.id
                  ? `${domain.gradient} text-primary-foreground shadow-md`
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {domain.icon} {domain.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground ml-6">Level:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {difficultyLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedDifficulty(selectedDifficulty === level.id ? null : level.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDifficulty === level.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex justify-end mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedDomain(null);
              setSelectedDifficulty(null);
            }}
            className="gap-2 text-muted-foreground"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
