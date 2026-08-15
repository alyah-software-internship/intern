<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records
     */
    public function all(): Collection
    {
        return $this->model->all();
    }

    /**
     * Find record by ID
     */
    public function find($id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Find record by ID or fail
     */
    public function findOrFail($id): Model
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Create new record
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update record
     */
    public function update($id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);
        return $record;
    }

    /**
     * Delete record
     */
    public function delete($id): bool
    {
        $record = $this->findOrFail($id);
        return $record->delete();
    }

    /**
     * Paginate records
     */
    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Get count of records
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Check if record exists
     */
    public function exists(array $conditions): bool
    {
        return $this->model->where($conditions)->exists();
    }

    /**
     * Get first record matching conditions
     */
    public function firstWhere(array $conditions): ?Model
    {
        return $this->model->where($conditions)->first();
    }

    /**
     * Get all records matching conditions
     */
    public function getWhere(array $conditions): Collection
    {
        return $this->model->where($conditions)->get();
    }
}