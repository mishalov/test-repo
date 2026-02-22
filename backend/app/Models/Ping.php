<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ping extends Model
{
    use HasFactory;
    public const UPDATED_AT = null;

    protected $table = 'pings';

    protected $fillable = ['uuid', 'battery_percent'];

    protected $casts = ['battery_percent' => 'integer'];
}
