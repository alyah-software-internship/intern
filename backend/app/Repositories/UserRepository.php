<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Find user by phone
     */
    public function findByPhone(string $phone): ?User
    {
        return $this->model->where('phone', $phone)->first();
    }

    /**
     * Get all vendors
     */
    public function getVendors(): Collection
    {
        return $this->model->where('role', 'vendor')->get();
    }

    /**
     * Get all customers
     */
    public function getCustomers(): Collection
    {
        return $this->model->where('role', 'customer')->get();
    }

    /**
     * Get active users
     */
    public function getActiveUsers(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Get users by role
     */
    public function getByRole(string $role): Collection
    {
        return $this->model->where('role', $role)->get();
    }

    /**
     * Get user with relationships
     */
    public function getWithRelations(int $userId, array $relations = []): ?User
    {
        return $this->model->with($relations)->find($userId);
    }
}