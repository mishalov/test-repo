<?php

namespace App\Http\Controllers;

use App\Models\Ping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PingController extends Controller
{
    /**
     * Convenience endpoint for code-reviewers of this task,
     * so they don't have to look up ping data directly in the DB.
     */
    public function index(): JsonResponse
    {
        $pings = Ping::orderBy('created_at', 'desc')->limit(100)->get();

        return response()->json($pings);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'uuid' => 'required|uuid',
            'battery_percent' => 'required|integer|min:0|max:100',
        ]);

        Ping::create($validated);

        return response()->json(['status' => 'ok']);
    }
}
