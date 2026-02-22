<?php

namespace Database\Factories;

use App\Models\Ping;
use Illuminate\Database\Eloquent\Factories\Factory;

class PingFactory extends Factory
{
    protected $model = Ping::class;

    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'battery_percent' => fake()->numberBetween(0, 100),
        ];
    }
}
