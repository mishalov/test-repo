<?php

namespace Tests\Feature;

use App\Models\Ping;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PingApiTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------
    // POST /api/ping (store)
    // -------------------------------------------------------

    public function test_store_creates_ping_with_valid_data(): void
    {
        $payload = [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 75,
        ];

        $response = $this->postJson('/api/ping', $payload);

        $response->assertStatus(200)
            ->assertExactJson(['status' => 'ok']);

        $this->assertDatabaseHas('pings', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 75,
        ]);
    }

    public function test_store_requires_uuid(): void
    {
        $response = $this->postJson('/api/ping', [
            'battery_percent' => 50,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['uuid']);
    }

    public function test_store_requires_valid_uuid_format(): void
    {
        $response = $this->postJson('/api/ping', [
            'uuid' => 'not-a-uuid',
            'battery_percent' => 50,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['uuid']);
    }

    public function test_store_requires_battery_percent(): void
    {
        $response = $this->postJson('/api/ping', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['battery_percent']);
    }

    public function test_store_rejects_battery_percent_above_100(): void
    {
        $response = $this->postJson('/api/ping', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 101,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['battery_percent']);
    }

    public function test_store_rejects_battery_percent_below_0(): void
    {
        $response = $this->postJson('/api/ping', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => -1,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['battery_percent']);
    }

    public function test_store_rejects_non_integer_battery_percent(): void
    {
        $response = $this->postJson('/api/ping', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 'abc',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['battery_percent']);
    }

    public function test_store_accepts_boundary_battery_values(): void
    {
        $responseZero = $this->postJson('/api/ping', [
            'uuid' => '550e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 0,
        ]);

        $responseZero->assertStatus(200)
            ->assertExactJson(['status' => 'ok']);

        $responseMax = $this->postJson('/api/ping', [
            'uuid' => '660e8400-e29b-41d4-a716-446655440000',
            'battery_percent' => 100,
        ]);

        $responseMax->assertStatus(200)
            ->assertExactJson(['status' => 'ok']);

        $this->assertDatabaseCount('pings', 2);
    }

    // -------------------------------------------------------
    // GET /api/ping (index)
    // -------------------------------------------------------

    public function test_index_returns_empty_array_when_no_pings_exist(): void
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_index_returns_pings_ordered_by_created_at_descending(): void
    {
        $oldest = Ping::factory()->create(['created_at' => now()->subHours(3)]);
        $newest = Ping::factory()->create(['created_at' => now()->subHours(1)]);
        $middle = Ping::factory()->create(['created_at' => now()->subHours(2)]);

        $response = $this->getJson('/api/ping');

        $response->assertStatus(200);

        $ids = array_column($response->json(), 'id');

        $this->assertEquals([$newest->id, $middle->id, $oldest->id], $ids);
    }

    public function test_index_returns_at_most_100_pings(): void
    {
        Ping::factory()->count(105)->create();

        $response = $this->getJson('/api/ping');

        $response->assertStatus(200);
        $this->assertCount(100, $response->json());
    }

    public function test_index_returns_correct_json_structure(): void
    {
        Ping::factory()->create();

        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['id', 'uuid', 'battery_percent', 'created_at'],
            ]);

        $firstPing = $response->json()[0];

        $this->assertArrayHasKey('id', $firstPing);
        $this->assertArrayHasKey('uuid', $firstPing);
        $this->assertArrayHasKey('battery_percent', $firstPing);
        $this->assertArrayHasKey('created_at', $firstPing);
        $this->assertArrayNotHasKey('updated_at', $firstPing);
    }
}
