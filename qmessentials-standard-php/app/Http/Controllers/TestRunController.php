<?php

namespace App\Http\Controllers;

use App\TestRun;
use App\Observation;
use App\ObservationResult;
use App\Lot;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TestRunController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $test_runs = \App\TestRun::all();
        return view('test-runs/test-runs', ['test_runs' => $test_runs]);
    }

    public function getItemsAndTestPlansForLot($lot_id) {
        $items = \App\Lot::find($lot_id)->items;
        $test_plans = \App\Lot::find($lot_id)
            ->product
            ->productTestPlans()->get()
            ->map(function($ptp) {
                return $ptp->testPlan;
            });
        return response()->json((object) ['items' => $items, 'testPlans' => $test_plans]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $lots = \App\Lot::all();
        return view('test-runs/create-test-run', ['lots' => $lots]);
    }

    private function is_observation_needed($sequence_number, $item_count, $usage_code) {
        if ($usage_code == '' || is_null($usage_code)) {
            return true;
        }
        if ($usage_code == 'Any') {
            return true;
        }
        if ($usage_code == 'All') {
            return true;
        }
        if ($usage_code == '1/L') {
            return true;
        }
        if (preg_match('/^(?<beginning>B)?(?<frequency>\d+)?(?<end>E)?$/', $usage_code, $matches)) {
            if (array_key_exists('beginning', $matches) && $matches['beginning'] == 'B' && $sequence_number == 1) {
                return true;
            }
            if (array_key_exists('end', $matches) && $matches['end'] == 'E' && $sequence_number == $item_count) {
                return true;
            }
            if (!array_key_exists('frequency', $matches)) {
                return false;
            }
            if ($matches['frequency'] == '') {
                return false;
            }
            if ($sequence_number % intval($matches['frequency']) == 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $item_id = $request->input('item_id');
        $test_plan_id = $request->input('test_plan_id');
        $item = \App\Item::find($item_id);
        $item_count_for_lot = $item->lot->items->count();
        $item_sequence_number = ($item->lot->items->where('created_at', '<', $item->created_at)->count() ?? 0) + 1;        
        DB::transaction(function() use ($item_id, $test_plan_id, $item_count_for_lot, $item_sequence_number) {
            $testRun = new \App\TestRun;
            $testRun->item_id = $item_id;
            $testRun->test_plan_id = $test_plan_id;
            $testRun->save();
            $test_plan_metrics = $testRun->testPlan->testPlanMetrics()->orderBy('sort_order')->get();
            foreach ($test_plan_metrics as $test_plan_metric) {
                if ($this->is_observation_needed($item_sequence_number, $item_count_for_lot, $test_plan_metric->usage_code)) {
                    $observation = new \App\Observation;
                    $observation->test_run_id = $testRun->id;
                    $observation->test_plan_metric_id = $test_plan_metric->id;
                    $observation->min_value = $test_plan_metric->min_value;
                    $observation->is_min_value_inclusive = $test_plan_metric->is_min_value_inclusive;
                    $observation->max_value = $test_plan_metric->max_value;
                    $observation->is_max_value_inclusive = $test_plan_metric->is_max_value_inclusive;
                    $observation->save();
                }
            }

        });        
        return redirect()->action('TestRunController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $test_run = TestRun::find($id);
        return view('test-runs/edit-test-run', ['test_run' => $test_run]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $testRun = \App\TestRun::find($id);
        DB::transaction(function() use ($testRun, $request) {
            foreach ($testRun->observations()->get() as $observation) {
                $observation->observationResults()->delete();
                $values = explode(' ', $request->input('observation-results-' . $observation->id));
                foreach ($values as $value) {
                    if ($value == '') {
                        continue;
                    }
                    $observationResult = new ObservationResult;
                    $observationResult->observation_id = $observation->id;
                    $observationResult->result_value = $value;
                    $observationResult->save();
                }
            }
        });        
        return redirect()->action('TestRunController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
