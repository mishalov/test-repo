<?php

namespace Tests\Unit\Models;

use App\Models\Ping;
use PHPUnit\Framework\TestCase;

class PingTest extends TestCase
{
    public function test_fillable_contains_expected_fields(): void
    {
        $ping = new Ping();

        $this->assertEquals(['uuid', 'battery_percent'], $ping->getFillable());
    }

    public function test_battery_percent_is_cast_to_integer(): void
    {
        $ping = new Ping();
        $casts = $ping->getCasts();

        $this->assertArrayHasKey('battery_percent', $casts);
        $this->assertEquals('integer', $casts['battery_percent']);
    }

    public function test_updated_at_is_disabled(): void
    {
        $this->assertNull(Ping::UPDATED_AT);
    }
}
