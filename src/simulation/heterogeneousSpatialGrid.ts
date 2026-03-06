import { CreatureCategory, CREATURE_CATEGORY_MAP, CreatureType } from './types';

export interface GridEntity {
    index: number;
    x: number;
    y: number;
    type: CreatureType;
}

class CategoryGrid {
    private cellSize: number;
    private cols: number;
    private rows: number;
    private grid: GridEntity[][][];

    constructor(width: number, height: number, cellSize: number) {
        this.cellSize = cellSize;
        this.cols = Math.max(1, Math.ceil(width / cellSize));
        this.rows = Math.max(1, Math.ceil(height / cellSize));
        this.grid = [];
        this.initGrid();
    }

    private initGrid() {
        this.grid = new Array(this.cols);
        for (let x = 0; x < this.cols; x++) {
            this.grid[x] = new Array(this.rows);
            for (let y = 0; y < this.rows; y++) {
                this.grid[x][y] = [];
            }
        }
    }

    resize(width: number, height: number) {
        this.cols = Math.max(1, Math.ceil(width / this.cellSize));
        this.rows = Math.max(1, Math.ceil(height / this.cellSize));
        this.initGrid();
    }

    clear() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                this.grid[x][y].length = 0;
            }
        }
    }

    add(entity: GridEntity) {
        const col = Math.floor(entity.x / this.cellSize);
        const row = Math.floor(entity.y / this.cellSize);
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.grid[col][row].push(entity);
        }
    }

    queryRadius(x: number, y: number, radius: number, typeFilter?: CreatureType[]): GridEntity[] {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        const radCells = Math.ceil(radius / this.cellSize);
        const results: GridEntity[] = [];
        const radiusSq = radius * radius;

        const minCol = Math.max(0, col - radCells);
        const maxCol = Math.min(this.cols - 1, col + radCells);
        const minRow = Math.max(0, row - radCells);
        const maxRow = Math.min(this.rows - 1, row + radCells);

        for (let c = minCol; c <= maxCol; c++) {
            for (let r = minRow; r <= maxRow; r++) {
                for (const entity of this.grid[c][r]) {
                    const dx = entity.x - x;
                    const dy = entity.y - y;
                    if (dx * dx + dy * dy <= radiusSq) {
                        if (!typeFilter || typeFilter.includes(entity.type)) {
                            results.push(entity);
                        }
                    }
                }
            }
        }

        return results;
    }

    // Get all entities in a grid (no distance filter)
    getAll(): GridEntity[] {
        const results: GridEntity[] = [];
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                results.push(...this.grid[x][y]);
            }
        }
        return results;
    }
}

export class HeterogeneousSpatialGrid {
    private grids: Record<CreatureCategory, CategoryGrid>;

    constructor(width: number, height: number, baseCellSize: number = 75) {
        this.grids = {
            [CreatureCategory.SMALL]: new CategoryGrid(width, height, baseCellSize),
            [CreatureCategory.MEDIUM]: new CategoryGrid(width, height, baseCellSize * 2),
            [CreatureCategory.LARGE]: new CategoryGrid(width, height, baseCellSize * 4),
        };
    }

    resize(width: number, height: number) {
        this.grids[CreatureCategory.SMALL].resize(width, height);
        this.grids[CreatureCategory.MEDIUM].resize(width, height);
        this.grids[CreatureCategory.LARGE].resize(width, height);
    }

    clear() {
        this.grids[CreatureCategory.SMALL].clear();
        this.grids[CreatureCategory.MEDIUM].clear();
        this.grids[CreatureCategory.LARGE].clear();
    }

    add(index: number, x: number, y: number, type: CreatureType) {
        const category = CREATURE_CATEGORY_MAP[type];
        if (category) {
            this.grids[category].add({ index, x, y, type });
        }
    }

    queryNearby(
        x: number,
        y: number,
        radius: number,
        options: { types?: CreatureType[]; categories?: CreatureCategory[] } = {}
    ): GridEntity[] {
        const results: GridEntity[] = [];

        let categoriesToQuery: CreatureCategory[];

        if (options.categories) {
            categoriesToQuery = options.categories;
        } else if (options.types) {
            // Deduplicate categories from types
            const categorySet = new Set<CreatureCategory>();
            for (const t of options.types) {
                const cat = CREATURE_CATEGORY_MAP[t];
                if (cat) categorySet.add(cat);
            }
            categoriesToQuery = Array.from(categorySet);
        } else {
            categoriesToQuery = Object.values(CreatureCategory) as CreatureCategory[];
        }

        for (const category of categoriesToQuery) {
            const grid = this.grids[category];
            if (grid) {
                results.push(...grid.queryRadius(x, y, radius, options.types));
            }
        }

        return results;
    }

    // Query for fish specifically (optimized common case)
    queryFish(x: number, y: number, radius: number): GridEntity[] {
        return this.grids[CreatureCategory.SMALL].queryRadius(x, y, radius, [
            CreatureType.FISH_DART,
            CreatureType.FISH_TROPICAL,
            CreatureType.FISH_SCHOOLING,
            CreatureType.FISH_ANGEL,
        ]);
    }

    // Query for predators (sharks, anglers)
    queryPredators(x: number, y: number, radius: number): GridEntity[] {
        const results: GridEntity[] = [];
        results.push(...this.grids[CreatureCategory.LARGE].queryRadius(x, y, radius, [
            CreatureType.SHARK,
            CreatureType.ANGLER_FISH,
        ]));
        return results;
    }

    // Query for large creatures
    queryLarge(x: number, y: number, radius: number): GridEntity[] {
        return this.grids[CreatureCategory.LARGE].queryRadius(x, y, radius);
    }

    // Query for medium creatures
    queryMedium(x: number, y: number, radius: number): GridEntity[] {
        return this.grids[CreatureCategory.MEDIUM].queryRadius(x, y, radius);
    }

    // Get all entities of a specific type
    getAllOfType(type: CreatureType): GridEntity[] {
        const category = CREATURE_CATEGORY_MAP[type];
        if (!category) return [];

        return this.grids[category].getAll().filter(e => e.type === type);
    }
}
